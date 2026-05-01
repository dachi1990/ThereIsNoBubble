# There Is No Bubble

`There Is No Bubble` is a live financial research dashboard that tests the "AI revolution, not a bubble" thesis against 20 market and macro indicators. The app compares current conditions with historical stress periods, updates data through a shared backend pipeline, and exposes operational health directly in the UI.

## What The App Includes

- 20 live metrics across equity valuation, market structure, credit, macro, monetary policy, sentiment, housing, and global risk
- 11 views: Dashboard, 8 research categories, Data Health, and Report
- Live refresh from a shared Vercel function pipeline
- Per-metric source, as-of date, and cadence metadata in the interface
- Mobile-first PWA shell with install metadata, app-shell caching, bottom navigation, and full-section hamburger navigation
- A Data Health tab for parser status, freshness, and source monitoring
- Scheduled GitHub Actions health checks every 6 hours with optional webhook alerts

## Stack

- React 18
- Vite
- Recharts
- Tailwind CSS v4
- Vercel Functions

## Project Structure

```text
.
├── api/
│   ├── _lib/metric-pipeline.js   # Shared metric collection, freshness checks, alerts
│   ├── data-health.js            # Operational health endpoint
│   ├── metrics.js                # Main live metrics payload
│   └── scraped-metrics.js        # Scraped-metric summary payload
├── public/                       # Favicons, OG assets, web manifest, service worker
├── scripts/
│   └── check-metrics.mjs         # Local/scheduled health-check runner
├── src/
│   ├── App.jsx                   # Main application shell and report
│   ├── index.css
│   └── main.jsx
├── .github/workflows/
│   └── data-health.yml           # Push + scheduled health monitoring
├── index.html
├── vercel.json
└── vite.config.js
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file if you want to run the metric health script locally:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173`.

By default, local `/api` requests are proxied to the deployed Vercel app via `vite.config.js`. That keeps the frontend usable in local development without running the serverless functions locally.

## Scripts

- `npm run dev` — start the Vite frontend with `/api` proxying
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run check:metrics` — run the live metric health check from Node

## Environment Variables

- `FRED_API_KEY` — required for local metric pipeline checks and Vercel serverless functions
- `VITE_FRED_API_KEY` — optional fallback for environments already using the Vite-prefixed name
- `ALERT_WEBHOOK_URL` — optional webhook target for scheduled health-check alerts

## Operations

The live app uses these endpoints:

- `/api/metrics` — full live metric payload plus histories
- `/api/data-health` — operational status summary
- `/api/scraped-metrics` — scraped-metric subset for external checks

Monitoring is defined in `.github/workflows/data-health.yml`. It runs on push, on manual dispatch, and every 6 hours on schedule.

## Mobile / PWA

- `public/site.webmanifest` defines the installable PWA metadata and app icons.
- `public/sw.js` caches the app shell while leaving `/api/*` requests network-first so live metrics stay fresh.
- On mobile, the bottom navigation focuses on the core reader paths: Home, Equity, Market, Credit, and Macro.
- The hamburger menu exposes the full research map: Dashboard, all 8 category tabs, and Report. Data Health remains available by direct route/footer on desktop, but is intentionally kept out of mobile reader navigation.
