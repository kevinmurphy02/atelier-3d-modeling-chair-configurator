# FORM/01 — 3D Office Chair Configurator

An interactive product configurator built as a portfolio demonstration using React, TypeScript, Three.js and React Three Fiber. The chair is created with procedural geometry, so **no external 3D asset is required**.

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL Vite prints (normally http://localhost:5173).

To produce a deployable static site:

```bash
npm run build
npm run preview
```

Deploy the `dist/` output to GitHub Pages, Netlify, or Vercel. `vite.config.ts` uses `base: './'` so it can live in a GitHub Pages project subfolder.

## What it demonstrates

- **React + TypeScript**: typed configuration state, data-driven selection controls, React hooks
- **3D**: React Three Fiber, parameterized geometry, lighting, shadows, orbit/zoom controls
- **Pricing**: transparent deterministic price calculation in `src/lib/config.ts`
- **UX**: live 3D feedback, accessible controls, selected states, mobile layout, itemized pricing
- **Shareable builds**: chosen options are serialized into URL query parameters; the share button copies the URL

## Price table (illustrative)

Base chair: $349. Upholstery: Charcoal / Oat included, Terracotta / Moss +$25. Frame: Graphite included, Aluminum +$55. Adjustable armrests +$45, Headrest +$35, Soft-roll casters +$20.

The configurator is a **concept**, not an actual storefront or checkout. Prices and materials are fictional.

## Architecture

- `src/components/ChairModel.tsx`: procedural 3D chair geometry responsive to selections
- `src/components/ChairCanvas.tsx`: rendering, lighting, shadows, camera controls
- `src/lib/config.ts`: product schema, pricing, defaults, URL parsing
- `src/App.tsx`: configurator UI and shared state
- `src/styles.css`: responsive design

## Optional next steps for an API portfolio feature

A production version might provide `GET /api/products/chair-01` for available options and `POST /api/quotes` to compute authoritative pricing server-side. Do not claim this demo currently includes a backend or uses REST APIs: price calculations are intentionally client-side.

## Portfolio copy

**3D Product Configurator — React, TypeScript, React Three Fiber**  
Built an interactive office chair configurator with procedural 3D geometry, live material and accessory controls, automatic itemized pricing, and shareable configurations. Designed a responsive UI with a clear separation between product data, pricing rules, and rendering logic.
