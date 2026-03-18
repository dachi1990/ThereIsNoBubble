# Bubble Risk Monitor

A comprehensive financial research dashboard that analyzes whether the US stock market is in a bubble by comparing 18 financial metrics against historical crisis periods (1929, 2000 Dot-Com, 2008 GFC).

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Recharts** — Charts and visualizations
- **DM Sans** — Typography (Google Fonts)

## Features

- 10 tabs: Dashboard + 8 metric categories + Research Report
- 18 financial metrics with plain-English explanations
- Light/Dark mode toggle
- SVG gauge for composite risk score
- Radar chart for category risk overview
- Risk score bars (0-100) on every metric
- Info tooltips with analogies and formulas
- Clickable scorecard rows → navigate to detail tabs
- Full equity research report with methodology and scenarios

## Data Sources

FRED, FactSet, Robert Shiller, S&P Dow Jones Indices, FINRA, ICE BofA, MacroMicro, GuruFocus

## Author

Dachi
