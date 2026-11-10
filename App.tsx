import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, CheckCheck, Copy, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { ChairCanvas } from './components/ChairCanvas';
import { BASE_PRICE, bases, DEFAULT_CONFIG, extras, formatPrice, parseConfig, serializeConfig, totalPrice, upholstery, type Base, type ChairConfig, type Extra, type Upholstery } from './lib/config';
import './styles.css';

export default function App() {
  const [config, setConfig] = useState<ChairConfig>(() => parseConfig(window.location.search));
  const [copied, setCopied] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const price = totalPrice(config);
  useEffect(() => {
    const url = `${window.location.pathname}?${serializeConfig(config)}`;
    window.history.replaceState(null, '', url);
  }, [config]);
  const update = <K extends keyof ChairConfig>(key: K, value: ChairConfig[K]) => setConfig(prev => ({ ...prev, [key]: value }));
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { window.prompt('Copy configuration link:', window.location.href); }
  };
  const additions = [
    ...(upholstery[config.upholstery].price ? [[upholstery[config.upholstery].label + ' fabric', upholstery[config.upholstery].price]] : []),
    ...(bases[config.base].price ? [[bases[config.base].label + ' base', bases[config.base].price]] : []),
    ...(Object.keys(extras) as Extra[]).filter(key => config[key]).map(key => [extras[key].label, extras[key].price]),
  ] as [string, number][];
  return <div className="app">
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Form studio home">FORM<span className="wordmark-slash">/</span>01<span className="wordmark-period">.</span></a>
      <span className="header-center">INTERACTIVE PRODUCT STUDIO</span>
      <a href="#configuration" className="header-link">CONFIGURE YOUR CHAIR <ArrowUpRight size={15} /></a>
    </header>

    <main id="top">
      <div className="intro">
        <div><div className="eyebrow"><span className="mini-line" /> AN EXERCISE IN CHOICE</div><h1>Made to fit <em>your</em> way<br />of working<span className="title-stop">.</span></h1></div>
        <div className="intro-aside"><span>THE OBJECT / NO. 001</span><p>One chair. Your specifications.<br />A little more room to make it yours.</p><ArrowDownRight size={23} strokeWidth={1.3} /></div>
      </div>

      <section className="workspace" aria-label="Chair customizer">
        <ChairCanvas config={config} />
        <aside className="config-panel" id="configuration">
          <div className="panel-head"><span className="eyebrow">BUILD YOUR OWN</span><span className="panel-step">01 — 03</span></div>
          <h2>The Task Chair<span className="sup-label">®</span></h2>
          <p className="panel-desc">An everyday essential, designed around the details you choose.</p>
          <div className="section-rule" />

          <section className="option-section" aria-labelledby="fabric-heading">
            <div className="option-heading"><span className="option-number">01</span><h3 id="fabric-heading">Upholstery</h3><span className="chosen">{upholstery[config.upholstery].label}</span></div>
            <div className="swatch-grid">{(Object.keys(upholstery) as Upholstery[]).map(key => <button type="button" key={key} className={`swatch-option ${config.upholstery === key ? 'selected' : ''}`} onClick={() => update('upholstery', key)} aria-label={`${upholstery[key].label} fabric, ${upholstery[key].price ? '+' + formatPrice(upholstery[key].price) : 'included'}`} aria-pressed={config.upholstery === key}>
              <span className="swatch-circle" style={{ backgroundColor: upholstery[key].hex }}>{config.upholstery === key && <Check size={17} strokeWidth={2} color={key === 'oat' ? '#272927' : '#ffffff'} />}</span>
              <span className="swatch-name">{upholstery[key].label}</span><span className="swatch-price">{upholstery[key].price ? `+${formatPrice(upholstery[key].price)}` : 'Included'}</span>
            </button>)}</div>
          </section>
          <div className="section-rule" />

          <section className="option-section" aria-labelledby="base-heading">
            <div className="option-heading"><span className="option-number">02</span><h3 id="base-heading">Frame finish</h3></div>
            <div className="finish-options">{(Object.keys(bases) as Base[]).map(key => <button type="button" key={key} className={`finish-option ${config.base === key ? 'selected' : ''}`} aria-pressed={config.base === key} onClick={() => update('base', key)}><span className="finish-dot" style={{ background: bases[key].hex }} /><span>{bases[key].label}</span><span className="finish-price">{bases[key].price ? `+${formatPrice(bases[key].price)}` : 'Included'}</span><span className="radio-mark">{config.base === key && <span />}</span></button>)}</div>
          </section>
          <div className="section-rule" />

          <section className="option-section" aria-labelledby="extra-heading">
            <div className="option-heading"><span className="option-number">03</span><h3 id="extra-heading">The finishing touches</h3></div>
            <div className="extras-list">{(Object.keys(extras) as Extra[]).map(key => <label className="extra-row" key={key}><input type="checkbox" checked={config[key]} onChange={e => update(key, e.target.checked)} /><span className="custom-checkbox">{config[key] && <Check size={14} strokeWidth={2.5} />}</span><span className="extra-details"><strong>{extras[key].label}</strong><small>{extras[key].desc}</small></span><span className="extra-price">+{formatPrice(extras[key].price)}</span></label>)}</div>
          </section>

          <div className="price-card"><div><span className="price-caption">YOUR CONFIGURATION</span><strong aria-live="polite" aria-atomic="true">{formatPrice(price)}</strong></div><button type="button" onClick={() => setSummaryOpen(v => !v)} className="price-detail" aria-expanded={summaryOpen}><SlidersHorizontal size={15} /> {summaryOpen ? 'HIDE DETAILS' : 'PRICE DETAILS'}</button></div>
          {summaryOpen && <div className="price-breakdown"><div><span>Task Chair / base model</span><span>{formatPrice(BASE_PRICE)}</span></div>{additions.map(([label, amount]) => <div key={label}><span>{label}</span><span>+{formatPrice(amount)}</span></div>)}<div className="total-line"><strong>Total</strong><strong>{formatPrice(price)}</strong></div></div>}
          <div className="panel-actions"><button type="button" className="primary-cta" onClick={share}>{copied ? <CheckCheck size={17} /> : <Copy size={16} />}{copied ? 'LINK COPIED' : 'SHARE YOUR BUILD'} <ArrowUpRight size={18} /></button><button type="button" className="reset-cta" aria-label="Reset to default configuration" title="Reset configuration" onClick={() => setConfig({ ...DEFAULT_CONFIG })}><RotateCcw size={18} /></button></div>
          <p className="demo-note">Concept project · Prices are illustrative · No checkout</p>
        </aside>
      </section>
      <div className="bottom-strip"><span>DESIGNED TO BE DIFFERENT</span><span>ROTATE. CUSTOMIZE. REIMAGINE.</span><span>REACT / TYPESCRIPT / THREE.JS</span></div>
    </main>
    <footer className="footer"><span>FORM/01 — A PRODUCT CONFIGURATOR STUDY</span><span>BUILT FOR THE WEB, NOT THE SHOWROOM.</span></footer>
  </div>;
}
