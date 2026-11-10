export const BASE_PRICE = 349;
export const upholstery = {
  charcoal: { label: 'Charcoal', hex: '#343b3b', price: 0, subtitle: 'Woven performance fabric' },
  oat: { label: 'Oat', hex: '#b7ac9b', price: 0, subtitle: 'Woven performance fabric' },
  rust: { label: 'Terracotta', hex: '#a65e47', price: 25, subtitle: 'Premium woven fabric' },
  moss: { label: 'Moss', hex: '#586557', price: 25, subtitle: 'Premium woven fabric' },
} as const;
export const bases = {
  graphite: { label: 'Graphite', hex: '#444b4c', price: 0 },
  aluminum: { label: 'Polished aluminum', hex: '#b4b9bb', price: 55 },
} as const;
export const extras = {
  arms: { label: 'Adjustable armrests', desc: 'Padded, height-adjustable look', price: 45 },
  headrest: { label: 'Integrated headrest', desc: 'Additional upper-back support', price: 35 },
  wheels: { label: 'Soft-roll casters', desc: 'For hard floors and quiet movement', price: 20 },
} as const;
export type Upholstery = keyof typeof upholstery;
export type Base = keyof typeof bases;
export type Extra = keyof typeof extras;
export type ChairConfig = { upholstery: Upholstery; base: Base; arms: boolean; headrest: boolean; wheels: boolean };
export const DEFAULT_CONFIG: ChairConfig = { upholstery: 'charcoal', base: 'graphite', arms: true, headrest: false, wheels: false };
export function totalPrice(config: ChairConfig) {
  return BASE_PRICE + upholstery[config.upholstery].price + bases[config.base].price +
    (Object.keys(extras) as Extra[]).reduce((total, key) => total + (config[key] ? extras[key].price : 0), 0);
}
export function parseConfig(search: string): ChairConfig {
  const p = new URLSearchParams(search);
  const u = p.get('fabric'); const b = p.get('base');
  return {
    upholstery: u && Object.prototype.hasOwnProperty.call(upholstery, u) ? u as Upholstery : DEFAULT_CONFIG.upholstery,
    base: b && Object.prototype.hasOwnProperty.call(bases, b) ? b as Base : DEFAULT_CONFIG.base,
    arms: p.has('arms') ? p.get('arms') === '1' : DEFAULT_CONFIG.arms,
    headrest: p.get('headrest') === '1',
    wheels: p.get('wheels') === '1',
  };
}
export function serializeConfig(config: ChairConfig): string {
  return new URLSearchParams({ fabric: config.upholstery, base: config.base, arms: config.arms ? '1' : '0', headrest: config.headrest ? '1' : '0', wheels: config.wheels ? '1' : '0' }).toString();
}
export const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
