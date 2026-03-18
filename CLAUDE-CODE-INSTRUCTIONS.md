# Bubble Risk Monitor — Claude Code Instructions

## Project Overview

This is a **React-based financial research dashboard** that analyzes whether the US stock market is in a bubble by comparing 18 financial metrics against historical crisis periods (1929, 2000 Dot-Com, 2008 GFC). 

**Current state:** A working single-file React JSX artifact (`bubble-risk-monitor.jsx`) that renders in Claude.ai's artifact viewer. It needs to be converted into a proper standalone web application that can be deployed.

**Target:** A deployable Next.js or Vite+React application with the same functionality, improved with:
1. Real-time data fetching via FRED API and other free financial APIs
2. Proper routing for each tab
3. PDF/image export for the research report
4. Mobile responsiveness
5. SEO metadata

---

## Architecture

### Current Structure (Single File)
The entire app lives in one JSX file with:
- Dual theme system (dark/light) via React Context
- 10 tab views (Dashboard + 8 metric categories + Research Report)
- 18 financial metrics with plain-English explanations
- Recharts-based visualizations
- Info tooltip popups on every metric
- Collapsible "What is this metric?" explainers on each tab
- SVG gauge for composite risk score
- Risk score bars (0-100) on every scorecard row
- Clickable scorecard rows → navigate to detail tab

### Desired Structure (Multi-file App)
```
bubble-risk-monitor/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── RiskBar.tsx
│   │   │   ├── Gauge.tsx
│   │   │   ├── InfoButton.tsx
│   │   │   ├── Explainer.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   ├── StatBox.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── charts/
│   │   │   ├── AreaChartWrapper.tsx
│   │   │   ├── BarChartWrapper.tsx
│   │   │   └── ChartTooltip.tsx
│   │   ├── tabs/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EquityValuation.tsx
│   │   │   ├── MarketStructure.tsx
│   │   │   ├── CreditDebt.tsx
│   │   │   ├── MacroFundamentals.tsx
│   │   │   ├── MonetaryPolicy.tsx
│   │   │   ├── Sentiment.tsx
│   │   │   ├── Housing.tsx
│   │   │   ├── GlobalRisk.tsx
│   │   │   └── ResearchReport.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── data/
│   │   ├── metrics.ts          # All 18 metrics with info, calc, scores
│   │   ├── chartData.ts        # Historical time series for all charts
│   │   └── constants.ts        # Tab names, color system, etc.
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useFredData.ts      # Optional: live FRED API fetching
│   ├── lib/
│   │   ├── themes.ts           # Dark/light theme objects
│   │   └── utils.ts            # Signal color helpers, etc.
│   └── styles/
│       └── globals.css
├── package.json
└── README.md
```

---

## Complete Metrics Data

### The 18 Metrics (with all fields needed)

Each metric has these fields:
- `name`: Display name
- `current`: Current value (string)
- `crisis2000`: Value at 2000 dot-com peak
- `crisis2008`: Value at 2008 GFC peak
- `historicalAvg`: Long-term average
- `signal`: "green" | "yellow" | "red"
- `riskScore`: 0-100 (higher = more risk)
- `tabIndex`: Which tab this metric appears in (1-8)
- `info`: Plain-English explanation with real-world analogy
- `calc`: Formula string
- `category`: Category name

```
1. Shiller CAPE Ratio
   Current: 38.1 | 2000: 44.2 | 2008: 27.5 | Avg: 17.6
   Signal: RED | Risk: 85 | Tab: Equity Valuation
   Info: "How many years of profits are you paying for? Take the S&P 500 price ÷ 10-year average inflation-adjusted earnings. Example: A lemonade stand earning $10/year — if you pay $380, the CAPE is 38. You're paying 38 years' profits upfront. Average is ~17.6, so at 38.1 you pay double the normal price."
   Formula: S&P 500 Price ÷ 10Y Avg Inflation-Adj EPS

2. Forward P/E
   Current: 20.9 | 2000: 25.5 | 2008: 15.2 | Avg: 16.7
   Signal: YELLOW | Risk: 60 | Tab: Equity Valuation
   Info: "How much you pay for NEXT year's expected profits. If Apple earns $7/share next year and trades at $146, its P/E is ~21x. For the S&P 500 at 20.9x, you pay $20.90 per $1 of expected earnings. Unlike 2000, today's expectations are backed by real 8%+ revenue growth."
   Formula: S&P 500 Price ÷ Next-12-Month Expected EPS

3. Buffett Indicator
   Current: 217% | 2000: 148% | 2008: 110% | Avg: 90%
   Signal: RED | Risk: 95 | Tab: Equity Valuation
   Info: "Buffett's favorite: total stock market value vs. the entire economy. If all companies are worth $60T but the economy produces $28T/year = 217%. Like a restaurant valued at 2x annual revenue. BUT: companies earn 40% overseas, and GDP only counts domestic, so the ratio structurally overstates."
   Formula: Total US Market Cap ÷ US GDP × 100

4. Equity Risk Premium
   Current: 1.5% | 2000: −0.5% | 2008: 2.0% | Avg: 4.0%
   Signal: YELLOW | Risk: 55 | Tab: Equity Valuation
   Info: "The 'bonus return' stocks offer over safe bonds. If stocks return 5.7% and Treasuries pay 4.2%, the ERP is 1.5%. In 2000, this went NEGATIVE — investors accepted LESS from risky stocks than safe bonds. Today at 1.5%, slim but positive."
   Formula: Expected Stock Return − 10Y Treasury Yield

5. Top 10 Concentration
   Current: 39% | 2000: 27% | 2008: 20% | Avg: 19%
   Signal: RED | Risk: 90 | Tab: Market Structure
   Info: "What % of the S&P 500 is just the 10 biggest companies. Imagine 500 students where the top 10 hold 39% of all lunch money. Apple + MSFT + NVIDIA alone ≈ 20%. Most concentrated ever — but they also produce 32.5% of all earnings."
   Formula: Top 10 Market Caps ÷ Total S&P 500 Cap × 100

6. FINRA Margin Debt
   Current: $1.28T | 2000: $278B | 2008: $381B | Avg: $347B
   Signal: RED | Risk: 80 | Tab: Market Structure
   Info: "Money borrowed to buy stocks. You have $100K, borrow $100K more from your broker = margin debt. $1.28T borrowed nationwide — a record. Danger: if stocks drop, brokers demand repayment ('margin call'), forcing selling → cascade."
   Formula: Total dollars borrowed from brokers to buy securities

7. Margin Debt / Mkt Cap
   Current: 1.85% | 2000: 2.5% | 2008: 2.7% | Avg: 2.0%
   Signal: GREEN | Risk: 30 | Tab: Market Structure
   Info: "Borrowed money RELATIVE to market size — the fairer measure. At 1.85%, today's leverage is BELOW both 2000 (2.5%) and 2008 (2.7%). Less aggressive than headlines suggest."
   Formula: Margin Debt ÷ Total Market Cap × 100

8. Yield Curve (10Y−2Y)
   Current: +25bp | 2000: −50bp | 2008: −20bp | Avg: +100bp
   Signal: YELLOW | Risk: 50 | Tab: Credit & Debt
   Info: "Difference between long-term and short-term bond rates. When it 'inverts' (short > long), recession follows in 12-24 months. Today at +25bp, un-inverted — cautiously positive."
   Formula: 10Y Treasury Yield − 2Y Treasury Yield (100bp = 1%)

9. HY Credit Spread
   Current: 3.3% | 2000: 8.0% | 2008: 21.8% | Avg: 4.9%
   Signal: YELLOW | Risk: 45 | Tab: Credit & Debt
   Info: "Extra interest risky companies pay vs. the government. Tight spread = confidence or complacency. Before 2008, 2.6% → exploded to 21.8%."
   Formula: High-Yield Bond Yield − Treasury Yield

10. Household Debt/Income
    Current: 88% | 2000: 97% | 2008: 133% | Avg: 100%
    Signal: GREEN | Risk: 15 | Tab: Credit & Debt
    Info: "How much families owe vs. earn. At 88%, consumers are in the best shape in 30+ years. Strongest 'not a bubble' data point."
    Formula: Total Household Debt ÷ Disposable Income × 100

11. S&P EPS Growth
    Current: +15.3% | 2000: −2% | 2008: −30% | Avg: +8%
    Signal: GREEN | Risk: 10 | Tab: Macro
    Info: "How fast profits grow. At +15.3%, nearly double average. In 2000 earnings FELL. Companies are genuinely more profitable."
    Formula: Current Year EPS ÷ Prior Year EPS − 1

12. GDP Growth
    Current: ~2.5% | 2000: 1.0% | 2008: −4.3% | Avg: 2.5%
    Signal: GREEN | Risk: 20 | Tab: Macro
    Info: "Growth of entire US economy. At long-run average. Before 2008, GDP shrank 4.3%. Today, reality supports prices."
    Formula: Change in Inflation-Adjusted GDP (annualized %)

13. Fed Funds Rate
    Current: 3.6% | 2000: 6.5% | 2008: 5.25% | Avg: 3.5%
    Signal: GREEN | Risk: 25 | Tab: Monetary Policy
    Info: "Most important rate in the world. At 3.6%, near average. Before 2000/2008, Fed pushed to 5-6.5%. Today Fed is CUTTING — tailwinds."
    Formula: Set by FOMC at 8 meetings/year

14. M2 Money Supply
    Current: $21.8T | 2000: $4.9T | 2008: $8.0T | Avg: N/A
    Signal: YELLOW | Risk: 50 | Tab: Monetary Policy
    Info: "All money in the economy. During COVID Fed pumped 40% more in. At $21.8T growing 4.6%/yr above GDP, the pool is very full."
    Formula: Currency + checking + savings + money market funds

15. Fed Balance Sheet
    Current: $6.5T | 2000: $0.6T | 2008: $0.9T | Avg: N/A
    Signal: YELLOW | Risk: 55 | Tab: Monetary Policy
    Info: "Bonds the Fed bought to pump money in. Shopping cart was $0.9T before 2008, hit $8.8T, now $6.5T. Unwinding orderly but slow."
    Formula: Total Fed assets (bonds, MBS, etc.)

16. VIX
    Current: ~22 | 2000: 33 | 2008: 80 | Avg: 19
    Signal: YELLOW | Risk: 45 | Tab: Sentiment
    Info: "Fear gauge. Pre-bubble VIX was LOW (9-11) = complacency. Today's 22 near average is healthier."
    Formula: From S&P 500 options; annualized expected volatility

17. Case-Shiller HPI
    Current: 332 | 2000: 100 | 2008: 190→140 | Avg: N/A
    Signal: YELLOW | Risk: 40 | Tab: Housing
    Info: "Home prices indexed to 100 in 2000. At 332 but driven by supply shortage, not reckless lending. FICO ~740, 95% fixed-rate."
    Formula: Repeat-sale index, 20 metro areas

18. Global Debt/GDP
    Current: 338% | 2000: 230% | 2008: 305% | Avg: N/A
    Signal: RED | Risk: 75 | Tab: Global Risk
    Info: "All debt worldwide vs. global GDP. Makes downturns worse by limiting fiscal response."
    Formula: Global Govt + Corp + Household Debt ÷ Global GDP × 100
```

---

## Design System

### Theme Colors (Dark Mode)
```
Background:      #0a0e17
Card:            #111827
Card Alt:        #0f172a
Border:          #1e293b
Text:            #e2e8f0
Text Muted:      #94a3b8
Text Dim:        #64748b
Green:           #34d399
Yellow:          #fbbf24
Red:             #f87171
Blue:            #60a5fa
Purple:          #a78bfa
Cyan:            #22d3ee
Orange:          #fb923c
Accent:          #818cf8
```

### Theme Colors (Light Mode)
```
Background:      #f5f7fb
Card:            #ffffff
Card Alt:        #f0f4f8
Border:          #d8dfe9
Text:            #111827
Text Muted:      #4b5563
Text Dim:        #9ca3af
Green:           #059669
Yellow:          #b45309
Red:             #dc2626
Blue:            #2563eb
Purple:          #7c3aed
Cyan:            #0891b2
Orange:          #c2410c
Accent:          #4f46e5
```

### Typography
- Font: DM Sans (Google Fonts)
- Headings: 800-900 weight, -1.5 letter-spacing
- Body: 400-500 weight
- Monospace for data: system monospace
- Stat numbers: 24px, 800 weight

### Component Patterns
- Cards: 14px border-radius, 20px padding, 1px border
- Signal badges: pill shape, 20px radius, with dot indicator
- Risk bars: 6px height, rounded, gradient fill green→yellow→red
- Chart cards: card wrapper with title, badge, chart area (260px), interpretation panel
- Info icons: 18px circle, italic "i", click → popup with explanation + formula
- Explainer accordions: accent background, collapsible, "What is [metric]?" format

---

## Key Features to Preserve

1. **Light/Dark Mode Toggle** — sticky header with sun/moon toggle
2. **Gauge Visualization** — SVG semicircle with needle for composite score
3. **Radar Chart** — 8 category risk overview
4. **Info Tooltips** — click "i" on any metric for plain-English explanation
5. **Explainer Accordions** — on each tab, collapsible "What is this?" panels
6. **Risk Score Bars** — 0-100 colored progress bars on every scorecard row
7. **Clickable Rows** — scorecard rows navigate to detail tab
8. **Bull/Bear Highlights** — dashboard shows top 3 green/red signals
9. **Research Report** — full equity research write-up with methodology, bull/bear case, historical comparison matrix, probability scenarios
10. **Tab Transitions** — fade animation on tab switch

---

## Chart Data Format

All chart data uses `{ y: "year", v: number }` format for the reusable AreaChart wrapper.
Bar charts and composed charts use custom data keys.

The AreaChart wrapper component (`AC`) takes:
- `data`: array of {y, v}
- `color`: stroke/fill color
- `id`: gradient ID
- `yFmt`: Y-axis formatter function
- `refY`: reference line Y value
- `refLabel`: reference line label
- `refColor`: reference line color
- `name`: tooltip series name
- `domainY`: Y-axis domain [min, max]

---

## Research Report Content

The report tab contains a full equity research piece with:
1. **Executive Summary** — composite score, verdict
2. **Methodology** — scoring approach (0-100 per metric)
3. **Bull Case (5 pillars)** — earnings, household health, ERP, cooled froth, no systemic mechanism
4. **Bear Case (4 risks)** — valuations, concentration, credit complacency, AI capex
5. **Historical Comparison Matrix** — 1929 vs 2000 vs 2008 vs 2026 across 6-8 dimensions
6. **Probability Scenarios** — Base 55%, Bull 25%, Bear 20% with cards
7. **Conclusion** — "Elevated but not a bubble"
8. **Attribution** — Monticello Fund, Darden Capital Management

---

## Potential Enhancements for Claude Code

1. **Live Data via FRED API** — fetch CAPE, yield curve, VIX, M2, Fed balance sheet, HY spreads in real-time (FRED API is free with key)
2. **PDF Export** — generate downloadable PDF of the research report using html2pdf or react-pdf
3. **URL Routing** — `/dashboard`, `/equity`, `/credit`, `/report` etc.
4. **Mobile Responsive** — current layout assumes desktop; needs mobile breakpoints
5. **Data last-updated timestamps** — show when each metric was last refreshed
6. **Shareable chart images** — export individual charts as PNG
7. **Animation on scroll** — fade-in charts as they enter viewport
8. **Search/filter scorecard** — filter metrics by signal type or category

---

## Technical Notes

- Built with React 18+ hooks (useState, useEffect, useRef, createContext, useContext)
- Recharts library for all visualizations
- No external CSS framework — all inline styles
- Theme switching via Context API
- The artifact file (`bubble-risk-monitor.jsx`) is the complete working source
- Composite risk score = unweighted average of all 18 metric scores
- Overall verdict: score < 30 = "Healthy", 30-60 = "Elevated", > 60 = "Bubble Warning"
