# Handoff: Nasdaq-100 Forward P/E Data Research

**Status**: Research task — blocker for a Phase 2 feature add.
**Created**: 2026-04-23 by the Claude session working on branch `claude/strange-pare-afde44`.
**Goal**: Find a reliable source of Nasdaq-100 Forward P/E historical data so we can add a "Nasdaq-100 Forward P/E vs. 10-year average" chart to the Bubble Risk Monitor.

---

## 1. Project context (get up to speed)

This repo is **ThereIsNoBubble.com** — a single-page Vite + React 18 dashboard deployed on Vercel. It tracks ~20 financial indicators (valuation, leverage, credit, macro, liquidity, sentiment) and scores each against historical crisis periods to produce a composite bubble-risk score.

**Stack**: Vite + React 18, Recharts, deployed on Vercel with Node serverless functions for the data pipeline.

**Key files to skim first** (in this order, ~10 min):

| File | What it is |
|---|---|
| `CLAUDE.md` | Project overview, architecture, the 20 metric definitions |
| `src/App.jsx` (2,100 lines, one file) | The entire frontend — themes, metric array `MS`, charts, tabs, research report |
| `api/_lib/metric-pipeline.js` (1,000 lines) | The backend data pipeline — `METRIC_REGISTRY`, scrapers, FRED API calls, derived metrics |
| `api/metrics.js`, `api/data-health.js`, `api/scraped-metrics.js` | Vercel serverless endpoints that wrap the pipeline |
| `scripts/check-metrics.mjs` | CLI to verify all 20 metrics return values |
| `README.md` | Short version |

**Important structural notes**:

- `MS` is an ordered array of 20 metrics in `src/App.jsx` starting around line 115. Each metric has `{nm, cur, c00, c08, avg, dir, nv, na, nc, sc, sig, tab, info, calc, src, srcUrl, asOf, freq}`.
- `METRIC_REGISTRY` in `api/_lib/metric-pipeline.js` is the backend counterpart with one entry per metric. Pipelines can be `"scrape"`, `"fred"`, `"bis"`, `"derived"`, or `"fred-derived"`.
- Existing scrapers include: Multpl (CAPE, EPS growth), Yardeni (Forward P/E, EPS growth), currentmarketvaluation.com (Buffett, Margin Debt), Slickcharts (Top-10 concentration). Pattern is regex over normalized HTML text.
- The app scores each metric 0–100 via `riskScore(nv, na, nc, dir)` in `src/App.jsx:106`. `na` = long-run average. `nc` = "crisis" peak. `dir = 1` means higher is more risky.

---

## 2. What we're adding (and why you're here)

The user wants to **drop the "FINRA Margin Debt" display** (it's redundant with the normalized "Margin Debt / Market Cap" metric we already have) and **replace it with a "Nasdaq-100 Forward P/E vs. 10-year average" chart** in the Equity Valuation tab.

**Why this metric**: it's a contrarian signal — Nasdaq is the tech-heaviest index, and if *even* Nasdaq is below its own 10-year valuation average, that's evidence against a broad tech bubble. Inspiration: https://twitter.com/ConnorJBates_ posted a 5Y lookback chart showing Nasdaq FP/E at the 17th percentile of the last 5 years.

**User's explicit ask** (minimal scope): *"Just build a Nasdaq P/E chart with the 10-year average line and current position marker, that's it."*

No risk-score integration yet. No scorecard row. Just a visual chart on the Equity Valuation tab. Data-health will cover it automatically once it's in `METRIC_REGISTRY` with standard error handling.

---

## 3. Research question

**Find a source of Nasdaq-100 (NDX) Forward P/E historical data.**

- **Forward P/E** = index price ÷ consensus next-12-month expected operating EPS. (Not trailing P/E, though trailing is a usable fallback — clearly flag if that's all you find.)
- **Frequency**: Weekly ideal, monthly acceptable, quarterly OK
- **History**: At least April 2016 → April 2026 (10 years)
- **Format**: CSV / JSON / scrapeable HTML / API / static file
- **Refresh mechanism**: Ideally a way to fetch the latest value weekly or monthly

---

## 4. Sources already tried (don't repeat these)

| Source | URL | Result |
|---|---|---|
| MacroMicro | `en.macromicro.me/series/23955/nasdaq-100-pe` | Has exactly the data we want (10Y+ weekly). Page accessible in browser. CSV export gated behind paid "Business" plan. Page returns 403 to scrapers. |
| Siblis Research | `siblisresearch.com/data/nasdaq-100-pe-ratio/` | Has 40Y+ of quarterly data. Paid subscription required (~$100–300 one-time). Viable paid fallback. |
| GuruFocus | `gurufocus.com/economic_indicators/6778/nasdaq-100-pe-ratio` | 403 to scrapers |
| Financecharts | `financecharts.com/...` | 402 paywall |
| Wisesheets | — | Times out / blocks |
| Yardeni "Selected P/E Ratios" PDF | `archive.yardeni.com/pub/stockmktperatio.pdf` | Contains S&P 500 / S&P 400 / S&P 600 / Russell 2000 only. **No Nasdaq-100 data.** Already used for Forward P/E of S&P 500. |
| Invesco QQQ fact sheet | `invesco.com/.../qqq-invesco-qqq-etf-fact-sheet.pdf` | Current-quarter only. No public archive of prior fact sheets. |
| WSJ Markets Data | `wsj.com/market-data` | Blocked |
| FMP API docs | `site.financialmodelingprep.com/developer/docs/stable/nasdaq` | 403 from our fetcher. Free-tier capability unconfirmed — worth testing with a real API key. |
| Macrotrends `NDAQ` | `macrotrends.net/stocks/charts/NDAQ/...` | That's the ticker for **Nasdaq Inc. the company**, not the NDX index. Does not apply. |
| Curvo.eu | `curvo.eu/backtest/en/market-index/nasdaq-100` | Index performance only, not P/E. |
| FullRatio.com | `fullratio.com/stocks/nasdaq-ndaq/pe-ratio` | 403. Also ticker confusion (company vs index). |

---

## 5. Sources worth trying (ordered by promise)

### Tier 1 — free APIs likely to have what we need

1. **Alpha Vantage** — `alphavantage.co`. Free tier: 25 requests/day. They claim coverage of indices. Register for a key, test whether they have NDX forward P/E as a time series. Relevant endpoints: `FUNDAMENTAL_DATA`, `INDICATORS`.
2. **Financial Modeling Prep (FMP)** — `financialmodelingprep.com`. Free tier exists. Their Nasdaq Index API doc page was 403 from us — try with a real key. Check endpoints: `/api/v3/historical-price-full`, `/api/v3/key-metrics-ttm`, `/api/v4/historical-ratios`.
3. **Finnhub** — `finnhub.io`. Free tier. Has fundamentals. Check if they expose index-level P/E.
4. **Polygon.io** — `polygon.io`. Free tier. Lightweight on fundamentals but worth a look.
5. **Tiingo** — `tiingo.com`. Free tier. Fundamentals API available.
6. **Twelve Data** — `twelvedata.com`. Free tier. Check fundamentals endpoints.
7. **EOD Historical Data** — `eodhd.com`. Free tier (limited). Paid starts at ~$20/mo. Has deep index fundamentals.
8. **IEX Cloud** — `iexcloud.io`. Free tier. Check fundamentals coverage for indices.

### Tier 2 — compute it ourselves from components

- **NDX price**: Free from Yahoo (`^NDX`), Stooq, or FRED (`NASDAQ100`).
- **NDX aggregate forward EPS**: The missing piece. Check:
  - `indexes.nasdaqomx.com` — Nasdaq's own index methodology publishers sometimes post aggregate fundamentals
  - QQQ ETF NAV distribution reports from Invesco
  - NDX "Index Fact Sheet" archives
  - Wayback Machine snapshots of QQQ factsheets across quarters (walk every 3 months back 10 years)

If you can find a time series of NDX aggregate forward EPS, compute `P/E = price / EPS` per period.

### Tier 3 — Kaggle / public datasets / GitHub

- Search Kaggle for "Nasdaq 100 fundamentals", "NDX P/E", "index valuation"
- Search GitHub for repos that ingest index-level P/E — check `openbb`, `quantopian`, `financetoolkit`, `investpy`
- Python packages to try: `yfinance`, `pandas-datareader`, `openbb`, `investpy` — check if any expose index-level forward P/E (most don't, but worth confirming)

### Tier 4 — proxies (only if nothing else works)

These aren't Nasdaq-100 specifically but convey a similar "tech valuation vs. its own history" story:

1. **QQQ ETF weighted-average forward P/E** — identical in practice to NDX forward P/E, since QQQ tracks NDX
2. **NDXT** (Nasdaq 100 Technology Sector) — subset of NDX, more tech-concentrated
3. **S&P 500 Information Technology sector forward P/E** — Yardeni publishes this in `archive.yardeni.com/pub/peacocksp500.pdf` which we can already scrape

---

## 6. Constraints

- **Legitimate access only** — no ToS violations, no scraping blocked sources
- **Free preferred**, but one-time paid up to **~$200** is OK if it produces clean data (user approved this)
- **Forward P/E strongly preferred** — if only trailing is available, explicitly flag it
- **Output must be plottable** — clean date + value pairs, no mixed headers/footnotes

---

## 7. Deliverable

Please report back with:

1. **Best source found**
   - URL / API endpoint
   - Cost (free / $X one-time / $Y/mo)
   - Access method (API key / scrape / CSV download / paid download)
   - Whether it's forward or trailing P/E
2. **Sample data**
   - 5–10 actual rows (date + value) so we can verify it's real data, not hallucinated
3. **Refresh mechanism**
   - How to fetch the latest value going forward (API call pattern, scrape URL, manual monthly download, etc.)
4. **Fallback**
   - Second-best option in case the primary breaks
5. **Integration draft** (optional but helpful)
   - If your solution is API-based, a rough Node.js/fetch snippet that returns the series
   - If it's a static dataset, the CSV/JSON dumped inline in the response

If nothing meets the constraints, say so explicitly — **do not fabricate data**. The user has been explicit: shipping stubbed/fake P/E data on a public financial dashboard would be a reputation risk. If the answer is "it costs $X" or "here's a tier-4 proxy instead," that's a valid and welcome answer.

---

## 8. Success criteria

- I can plug the data into `src/App.jsx` (as a `let ndxPe = [{y:"2016-Q1", v:18.5}, ...]` style array)
- I can update the latest point automatically at some reasonable cadence (weekly / monthly)
- The 10-year average line computed from the data matches publicly-quoted figures (around 22.9x as of April 2026 per the user's reference chart)
- `/api/data-health` shows the metric's freshness and surfaces errors if the source breaks

---

## 9. How to hand results back

Either:
- Append findings to this file under a "## 10. Findings" section and commit, or
- Write a separate `docs/research/nasdaq-pe-findings.md` with the results and commit

Ping the Claude session (branch `claude/strange-pare-afde44`, worktree at `.claude/worktrees/strange-pare-afde44/`) when done. Claude will then wire the data into the dashboard, compute the 10Y average, add the chart to the Equity Valuation tab, drop the FINRA Margin Debt display, update the research report text, and push to `main` for Vercel to deploy.
