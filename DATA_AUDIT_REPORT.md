# Data Audit Report

Date: 2026-04-26  
Scope: 20 dashboard metrics, backend metric registry, main chart data, share-card chart data, and source provenance.

## Executive Verdict

I cannot honestly certify the project at "100% confidence" yet. The live API was healthy when checked, and most FRED/BIS-derived metrics verified cleanly against primary data. But the audit found several real provenance problems:

- Yardeni-backed `Forward P/E` and `S&P 500 EPS Growth (Est.)` are scraped from an older February 19, 2026 archive entry, while the endpoint previously labeled them as checked today. I changed the backend to record the actual Yardeni article date so Data Health can warn when those values are stale.
- `Margin Debt / Mkt Cap` was citing FINRA but actually using a third-party margin-debt scrape. I changed it to scrape FINRA's official Margin Statistics table directly.
- Several frontend fallback labels did not match the backend source or series, especially Buffett Indicator, GDP growth, ERP, and Case-Shiller.
- Many chart histories are hand-curated anchor points rather than fully generated source histories. They are directionally plausible, but not "100% auditable" point-by-point.
- Social share chart data in `src/chartShareRegistry.js` is static and can drift from the live API values.

## Changes Made

- `api/_lib/metric-pipeline.js`
  - Added official FINRA Margin Statistics scrape for raw margin debt.
  - Added month/date parsing helpers for FINRA and Yardeni pages.
  - Changed Yardeni scrape payloads to use the matched article date instead of today's scrape date.
  - Changed ERP source URL to FRED DGS10 and made ERP freshness reflect mixed daily/weekly inputs.
  - Made ERP `asOf` use the oldest dependency date, not just the Treasury date.

- `src/App.jsx`
  - Corrected Buffett fallback source from GuruFocus to currentmarketvaluation.com.
  - Corrected ERP fallback source URL/frequency.
  - Clarified margin debt source as a derived metric from FINRA, Buffett Indicator, and FRED GDP.
  - Corrected Real GDP Growth source URL/calculation text to the YoY FRED series actually used by the backend.
  - Corrected Case-Shiller from a 20-city description/source typo to the national seasonally adjusted FRED series actually used.

## Verification Snapshot

Live API checked: `https://www.thereisnobubble.com/api/metrics`  
Result before local fixes: 20/20 ok, checked at `2026-04-26T04:42:50.603Z`.

Local source checks after fixes:

- `npm run build`: passed.
- `fetchScrapedMetricValues()`: succeeded for CAPE, Buffett, FINRA margin debt, Slickcharts concentration, and Yardeni values.
- `npm run check:metrics`: still fails locally because no `FRED_API_KEY` is configured in this machine. It now also correctly warns that the Yardeni-backed Forward P/E and EPS Growth values are stale.

## Metric-by-Metric Audit

| # | Metric | Current source check | Confidence | Notes |
|---|---|---:|---|---|
| 1 | Shiller CAPE Ratio | Multpl page showed `40.66` at Fri Apr 24, 2026 close. | High current / Medium chart | Current value verified. Full chart should eventually be generated from Multpl/Shiller table instead of hand anchors. |
| 2 | Forward P/E | App value `21.8` comes from Yardeni's February 19, 2026 archive text. Nasdaq's official dashboard showed S&P 500 NTM P/E `20.10` as of April 8, 2026; Trendonify showed April 2026 `21.01`. | Not certified | Needs a cleaner current source. Backend now marks the Yardeni value stale instead of pretending it is fresh. |
| 3 | Buffett Indicator | currentmarketvaluation.com showed market cap `$72.14T`, GDP `$31.33T`, ratio `230%`. | Medium-high | Source is transparent and easy to verify, though not primary. |
| 4 | Equity Risk Premium | Formula is `100 / Forward P/E - DGS10`. With `21.8` and FRED DGS10 `4.34`, ERP is about `0.25%`. | Not certified | Formula is fine, but Forward P/E input is stale. |
| 5 | Top 10 Concentration | Deployed scrape returned `38.9909%`; Slickcharts search/crawl showed row-10 cumulative weight around `38.52%`. | Medium | Direct local curl hit Cloudflare. Use official S&P factsheet or ETF holdings if this needs primary-source confidence. |
| 6 | Nasdaq-100 Forward P/E | App uses static Trendonify value `21.04` as of April 7, 2026. Nasdaq official Global Index Dashboard showed Nasdaq-100 NTM P/E `22.09` and 10-year average `22.86` as of April 8, 2026. | Medium / needs replacement | Thesis direction still holds versus official dashboard, but the displayed value/source should be moved to Nasdaq if possible. |
| 7 | Margin Debt / Mkt Cap | FINRA official March 2026 debit balances: `$1,220,922 million`; derived ratio is about `1.69%` using Buffett market cap/GDP. | High after fix | Backend now uses FINRA official table instead of a third-party margin-debt scrape. |
| 8 | Yield Curve (10Y-2Y) | FRED T10Y2Y: `0.53` on 2026-04-24. | High | Current value and source verified. |
| 9 | HY Credit Spread | FRED BAMLH0A0HYM2: `2.86` on 2026-04-23. | High | Current value and source verified. |
| 10 | Household Debt/Income | FRED BOGZ1FL154190006Q: `92.7925` on 2025-10-01. | High | Current value and source verified. |
| 11 | S&P 500 EPS Growth (Est.) | App value `15.2%` comes from Yardeni's February 19, 2026 archive text. | Not certified | Needs a current, machine-readable earnings-growth source or a more robust Yardeni chart parser. |
| 12 | Real GDP Growth (YoY) | FRED A191RO1Q156NBEA: `2.0` on 2025-10-01. | High | Source/copy mismatch fixed. |
| 13 | Fed Funds Rate | FRED DFF: `3.64` on 2026-04-23. | High | Current value and source verified. |
| 14 | M2 Money Supply | FRED M2SL: `$22.6673T` on 2026-02-01; M2/GDP ratio `72.14%`. | High | Display uses dollars; scoring uses M2/GDP ratio. |
| 15 | Fed Balance Sheet | FRED WALCL: `$6.707419T` on 2026-04-22; balance-sheet/GDP ratio `21.35%`. | High | Display uses dollars; scoring uses assets/GDP ratio. |
| 16 | VIX | FRED VIXCLS: `19.31` on 2026-04-23. | High | Current value and source verified. |
| 17 | Case-Shiller HPI | FRED CSUSHPISA: `332.183` on 2026-01-01. | High | Frontend now correctly says national seasonally adjusted index, not 20-city. |
| 18 | Global Debt/GDP (BIS Proxy) | BIS bulk file official series latest: `246.3` for 2025-Q3. | High | Current value and source verified directly from BIS zip. |
| 19 | Capex / GDP | FRED PNFI `4364.412` / GDP `31422.526` = `13.889%`. | High | Current value and formula verified. |
| 20 | Capex / Operating Cash Flow | FRED PNFI `4364.412` / CNCF `4135.782` = `105.528%`. | High | Live API value is `106%`; some fallback/share text still says `111%`. |

## Chart Audit

The chart layer is the weakest part of the "100% confidence" requirement.

- The latest point of most main charts is updated from `/api/metrics`.
- `m2Ratio`, `fedBalanceSheetRatio`, and `earningsGrowth` histories are returned dynamically by the backend.
- Most other chart histories are hardcoded annual/sparse anchor points inside `src/App.jsx`.
- `src/chartShareRegistry.js` repeats separate static chart values for OG/social share cards.

That means the current values are mostly verified, but the full visual histories are not all source-generated. To certify the charts, the next step should be to replace hardcoded chart arrays with source-derived histories, or add explicit source notes for every sampled point.

## Recommended Next Work

1. Replace Yardeni text scraping for Forward P/E and EPS Growth with a current, machine-readable source. Best candidates: Nasdaq Global Index Dashboard / FactSet-derived dashboard for P/E, and a dependable FactSet/S&P/Yardeni chart endpoint for earnings growth.
2. Move Nasdaq-100 Forward P/E current value/source to Nasdaq's official Global Index Dashboard if the PDF can be reliably parsed or manually maintained.
3. Generate FRED-backed chart histories directly from FRED for all FRED metrics, not from static annual samples.
4. Generate `src/chartShareRegistry.js` from the same metric/chart source as the app, or make share OG images call the backend.
5. Add an audit/check script that compares live API outputs to public source snapshots and fails on stale scraped text.

## Sources Used

- Multpl Shiller PE: https://www.multpl.com/shiller-pe
- Yardeni Morning Briefing archive: https://archive.yardeni.com/morning-briefing-2026/
- Current Market Valuation Buffett Indicator: https://www.currentmarketvaluation.com/models/buffett-indicator.php
- FINRA Margin Statistics: https://www.finra.org/rules-guidance/key-topics/margin-accounts/margin-statistics
- FRED graph CSV endpoints and series pages: https://fred.stlouisfed.org/
- BIS Total Credit bulk download: https://data.bis.org/static/bulk/WS_TC_csv_col.zip
- Nasdaq Global Index Dashboard: https://www.nasdaq.com/docs/index/global-markets-dashboard
- Slickcharts S&P 500: https://www.slickcharts.com/sp500
- Trendonify S&P 500/Nasdaq forward P/E pages: https://trendonify.com/united-states/stock-market/forward-pe-ratio and https://trendonify.com/united-states/stock-market/nasdaq-100/forward-pe-ratio
