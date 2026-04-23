# There Is No Bubble — Agent Notes

## Current State

This repo is already a live, deployable Vite + React application on Vercel. It is not the old single-file artifact migration project anymore.

- Frontend: React 18 + Vite + Recharts + Tailwind v4
- Backend: Vercel serverless functions under `api/`
- Scope: 20 market and macro metrics across 11 views
- Tabs: Dashboard, 8 category tabs, Data Health, Report
- Routing: client-side path routing inside `src/App.jsx`
- Data: live `/api/metrics` payload plus supplemental histories

## Architecture

### Frontend

- `src/App.jsx` is still the main application shell.
- It contains the themes, metric array `MS`, tab components, charts, report copy, and `/api/metrics` refresh logic.
- The app mutates the in-memory `MS` array after each backend refresh, so UI metric order matters.

### Backend

- `api/_lib/metric-pipeline.js` is the source of truth for live metric collection.
- `METRIC_REGISTRY` defines the backend metric list and `idx` mapping into the frontend `MS` array.
- Pipelines currently include `scrape`, `fred`, `bis`, `derived`, and `fred-derived`.
- `/api/metrics` returns the full metric payload plus supplemental chart histories.
- `/api/data-health` returns the same health summary with shorter cache settings.
- `/api/scraped-metrics` exposes the scrape-backed subset for checks.

### Operational Checks

- `scripts/check-metrics.mjs` runs the shared pipeline locally and prints health results.
- GitHub Actions health monitoring is referenced in `README.md`.
- The app’s Data Health tab depends on the same backend payload as the main dashboard.

## Important Files

- `src/App.jsx`: main UI, report, chart definitions, client routing, live refresh
- `api/_lib/metric-pipeline.js`: metric registry, scrapers, FRED fetches, BIS logic, histories
- `api/metrics.js`: main live payload endpoint
- `api/data-health.js`: health endpoint
- `api/scraped-metrics.js`: scrape-only endpoint
- `src/index.css`: global styles and responsive helpers
- `README.md`: current product/readme summary
- `PROJECT.md`: lightweight business/runbook context
- `bubble-risk-monitor.jsx`: legacy artifact-era source snapshot; keep only as historical reference unless explicitly removing it

## Data Contract

- Keep `MS[i]` in `src/App.jsx` aligned with `METRIC_REGISTRY[idx]` in `api/_lib/metric-pipeline.js`.
- If a metric stays in the backend but is hidden in the UI, make sure any scorecard click target still resolves to a live anchor.
- Current supplemental histories returned by the backend are:
  - `m2Ratio`
  - `fedBalanceSheetRatio`
  - `earningsGrowth`

## Local Development

```bash
npm install
npm run dev
npm run build
npm run check:metrics
```

- Vite runs on `http://localhost:5173`.
- In local dev, `/api` is proxied to the deployed Vercel app by default via `vite.config.js`.

## Environment Variables

- `FRED_API_KEY`
- `VITE_FRED_API_KEY`
- `ALERT_WEBHOOK_URL`

## Editing Notes

- Preserve the single-file frontend structure unless the user explicitly asks for a refactor.
- Keep the report and dashboard copy internally consistent with the visible charts and tabs.
- When changing metric visibility, check:
  - the dashboard stat cards
  - the scorecard
  - `METRIC_SCROLL_TARGETS`
  - tab source lists
  - report text that references the changed metric

## Current Caveat

- The app is live and buildable today.
- The main technical debt is that the frontend remains concentrated in `src/App.jsx`, while the backend data pipeline is already modular enough for ongoing maintenance.
