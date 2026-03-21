import AdmZip from "adm-zip";

const SCRAPE_TIMEOUT_MS = 8000;
const BIS_TOTAL_CREDIT_ZIP_URL = "https://data.bis.org/static/bulk/WS_TC_csv_col.zip";
const BIS_TOTAL_CREDIT_TOPIC_URL = "https://data.bis.org/topics/TOTAL_CREDIT/tables-and-dashboards";
const BIS_PROXY_SERIES_PREFIX = "Q,Quarterly,5A,All reporting economies,C,Non financial sector,A,All sectors,M,Market value,770,Percentage of GDP,A,Adjusted for breaks,0,Units,367,Per cent,All reporting countries (aggregate) - Credit to Non financial sector from All sectors at Market value - Percentage of GDP - Adjusted for breaks,Q:5A:C:A:M:770:A,";
const BIS_HEADER_SPLIT_TOKEN = "TITLE_TS,Series,";

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; BubbleRiskMonitor/2.0; +https://github.com/dachi1990/ThereIsNoBubble)",
  "Accept-Language": "en-US,en;q=0.9",
};

const FRESHNESS_HOURS = {
  daily: 72,
  weekly: 24 * 21,
  monthly: 24 * 95,
  quarterly: 24 * 220,
  annual: 24 * 550,
};

export const METRIC_REGISTRY = [
  { id: "cape", idx: 0, name: "Shiller CAPE Ratio", pipeline: "scrape", source: "Multpl / Shiller", sourceUrl: "https://www.multpl.com/shiller-pe", frequency: "daily", min: 5, max: 80, freshness: "daily" },
  { id: "forwardPe", idx: 1, name: "Forward P/E", pipeline: "scrape", source: "Yardeni Research Morning Briefing", sourceUrl: "https://archive.yardeni.com/morning-briefing-2026/", frequency: "weekly", min: 5, max: 40, freshness: "weekly" },
  { id: "buffett", idx: 2, name: "Buffett Indicator", pipeline: "scrape", source: "currentmarketvaluation.com", sourceUrl: "https://www.currentmarketvaluation.com/models/buffett-indicator.php", frequency: "daily", min: 20, max: 350, freshness: "daily" },
  { id: "erp", idx: 3, name: "Equity Risk Premium (Fwd EY - 10Y)", pipeline: "derived", source: "Derived from Forward P/E and 10Y Treasury", sourceUrl: "https://www.multpl.com/10-year-treasury-rate", frequency: "daily", min: -10, max: 15, freshness: "daily" },
  { id: "top10Concentration", idx: 4, name: "Top 10 Concentration", pipeline: "scrape", source: "Slickcharts S&P 500", sourceUrl: "https://www.slickcharts.com/sp500", frequency: "daily", min: 0, max: 60, freshness: "daily" },
  { id: "marginDebt", idx: 5, name: "FINRA Margin Debt", pipeline: "scrape", source: "currentmarketvaluation.com", sourceUrl: "https://www.currentmarketvaluation.com/models/margin-debt.php", frequency: "monthly", min: 0, max: 5000, freshness: "monthly" },
  { id: "marginDebtToMarketCap", idx: 6, name: "Margin Debt / Mkt Cap", pipeline: "derived", source: "Derived from Margin Debt, Buffett Indicator, and FRED GDP", sourceUrl: "https://www.finra.org/rules-guidance/key-topics/margin-accounts/margin-statistics", frequency: "monthly", min: 0, max: 10, freshness: "monthly" },
  { id: "yieldCurve", idx: 7, name: "Yield Curve (10Y-2Y)", pipeline: "fred", source: "FRED T10Y2Y", sourceUrl: "https://fred.stlouisfed.org/series/T10Y2Y", frequency: "daily", min: -5, max: 5, freshness: "daily" },
  { id: "hySpread", idx: 8, name: "HY Credit Spread", pipeline: "fred", source: "FRED BAMLH0A0HYM2", sourceUrl: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2", frequency: "daily", min: 0, max: 30, freshness: "daily" },
  { id: "householdDebtIncome", idx: 9, name: "Household Debt/Income", pipeline: "fred", source: "FRED Z.1", sourceUrl: "https://fred.stlouisfed.org/series/BOGZ1FL154190006Q", frequency: "quarterly", min: 0, max: 250, freshness: "quarterly" },
  { id: "epsGrowth", idx: 10, name: "S&P 500 EPS Growth (Est.)", pipeline: "scrape", source: "Yardeni Research Morning Briefing", sourceUrl: "https://archive.yardeni.com/morning-briefing-2026/", frequency: "weekly", min: -100, max: 100, freshness: "weekly" },
  { id: "gdpGrowth", idx: 11, name: "Real GDP Growth (YoY)", pipeline: "fred", source: "FRED / BEA", sourceUrl: "https://fred.stlouisfed.org/series/A191RO1Q156NBEA", frequency: "quarterly", min: -20, max: 20, freshness: "quarterly" },
  { id: "fedFunds", idx: 12, name: "Fed Funds Rate", pipeline: "fred", source: "FRED DFF", sourceUrl: "https://fred.stlouisfed.org/series/DFF", frequency: "daily", min: 0, max: 20, freshness: "daily" },
  { id: "m2", idx: 13, name: "M2 Money Supply", pipeline: "fred-derived", source: "FRED M2SL", sourceUrl: "https://fred.stlouisfed.org/series/M2SL", frequency: "monthly", min: 0, max: 200, freshness: "monthly" },
  { id: "fedBalanceSheet", idx: 14, name: "Fed Balance Sheet", pipeline: "fred-derived", source: "FRED WALCL", sourceUrl: "https://fred.stlouisfed.org/series/WALCL", frequency: "weekly", min: 0, max: 100, freshness: "weekly" },
  { id: "vix", idx: 15, name: "VIX", pipeline: "fred", source: "FRED VIXCLS", sourceUrl: "https://fred.stlouisfed.org/series/VIXCLS", frequency: "daily", min: 0, max: 150, freshness: "daily" },
  { id: "caseShiller", idx: 16, name: "Case-Shiller HPI", pipeline: "fred", source: "FRED CSUSHPISA", sourceUrl: "https://fred.stlouisfed.org/series/CSUSHPISA", frequency: "monthly", min: 0, max: 500, freshness: "quarterly" },
  { id: "globalDebtProxy", idx: 17, name: "Global Debt/GDP (BIS Proxy)", pipeline: "bis", source: "BIS Total Credit - All reporting economies", sourceUrl: BIS_TOTAL_CREDIT_TOPIC_URL, frequency: "quarterly", min: 50, max: 400, freshness: "quarterly" },
  { id: "capexGdp", idx: 18, name: "Capex / GDP", pipeline: "derived", source: "Derived from FRED PNFI / GDP", sourceUrl: "https://fred.stlouisfed.org/series/PNFI", frequency: "quarterly", min: 0, max: 30, freshness: "quarterly" },
  { id: "capexOperatingCashFlow", idx: 19, name: "Capex / Operating Cash Flow (FRED Proxy)", pipeline: "derived", source: "Derived proxy from FRED PNFI / CNCF", sourceUrl: "https://fred.stlouisfed.org/series/CNCF", frequency: "quarterly", min: 0, max: 250, freshness: "quarterly" },
];

const METRIC_BY_ID = new Map(METRIC_REGISTRY.map((metric) => [metric.id, metric]));

const FRED_SERIES = {
  vix: { series: "VIXCLS", parse: (value) => parseFloat(value), display: (value) => value.toFixed(1) },
  yieldCurve: { series: "T10Y2Y", parse: (value) => parseFloat(value), display: (value) => `${value >= 0 ? "+" : ""}${Math.round(value * 100)}bp` },
  hySpread: { series: "BAMLH0A0HYM2", parse: (value) => parseFloat(value), display: (value) => `${value.toFixed(1)}%` },
  fedFunds: { series: "DFF", parse: (value) => parseFloat(value), display: (value) => `${value.toFixed(1)}%` },
  walcl: { series: "WALCL", parse: (value) => parseFloat(value) / 1e6 },
  m2: { series: "M2SL", parse: (value) => parseFloat(value) / 1e3 },
  caseShiller: { series: "CSUSHPISA", parse: (value) => parseFloat(value), display: (value) => value.toFixed(1) },
  gdp: { series: "GDP", parse: (value) => parseFloat(value) / 1e3 },
  gdpGrowth: { series: "A191RO1Q156NBEA", parse: (value) => parseFloat(value), display: (value) => `${value.toFixed(1)}%` },
  householdDebtIncome: { series: "BOGZ1FL154190006Q", parse: (value) => parseFloat(value), display: (value) => `${value.toFixed(0)}%` },
  treasury10y: { series: "DGS10", parse: (value) => parseFloat(value) },
  pnfi: { series: "PNFI", parse: (value) => parseFloat(value) },
  corporateCashFlow: { series: "CNCF", parse: (value) => parseFloat(value) },
};

const SCRAPED_IDS = new Set(["cape", "forwardPe", "buffett", "top10Concentration", "marginDebt", "epsGrowth"]);

function makeMetricState(spec) {
  return {
    ...spec,
    value: null,
    display: null,
    chartValue: null,
    asOf: null,
    checkedAt: null,
    status: "error",
    notes: [],
    dependencies: [],
  };
}

function applyMetricValue(target, payload) {
  target.value = payload.value;
  target.display = payload.display;
  target.chartValue = payload.chartValue ?? payload.value;
  target.asOf = payload.asOf ?? null;
  target.checkedAt = payload.checkedAt ?? null;
  target.dependencies = payload.dependencies ?? [];
  if (payload.source) target.source = payload.source;
  if (payload.sourceUrl) target.sourceUrl = payload.sourceUrl;
  if (payload.frequency) target.frequency = payload.frequency;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const response = await fetch(url, { headers: DEFAULT_HEADERS, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeScrapeText(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;|’/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

function extractFirstNumber(html, patterns) {
  if (!html) return null;
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match?.[1]) continue;
    const parsed = parseFloat(match[1].replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function roundValue(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function parseFredCsvRows(csv, parse) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const separator = line.indexOf(",");
      const date = line.slice(0, separator);
      const raw = line.slice(separator + 1);
      return { date, raw };
    })
    .filter((row) => row.date && row.raw && row.raw !== ".")
    .map((row) => ({
      ...row,
      parsed: parse(row.raw),
    }))
    .filter((row) => Number.isFinite(row.parsed));
}

async function fetchFredSeries(seriesId) {
  const csv = await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`);
  const rows = csv.trim().split(/\r?\n/).slice(1);

  for (let index = rows.length - 1; index >= 0; index -= 1) {
    const [date, raw] = rows[index].split(",");
    if (!date || !raw || raw === ".") continue;
    return { date, raw };
  }

  throw new Error(`FRED ${seriesId}: missing observation`);
}

async function fetchFredSeriesHistory(seriesId, parse) {
  const csv = await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`);
  return parseFredCsvRows(csv, parse);
}

async function fetchAllFred() {
  const entries = await Promise.all(
    Object.entries(FRED_SERIES).map(async ([key, config]) => {
      const result = await fetchFredSeries(config.series);
      return [
        key,
        {
          ...result,
          parsed: config.parse(result.raw),
        },
      ];
    }),
  );

  return Object.fromEntries(entries);
}

function findLatestObservationOnOrBefore(rows, targetDate) {
  let latest = null;
  for (const row of rows) {
    if (row.date > targetDate) break;
    latest = row;
  }
  return latest;
}

function buildAnnualRatioHistory({ numeratorRows, denominatorRows, startYear }) {
  const latestNumeratorByYear = new Map();
  numeratorRows.forEach((row) => {
    const year = Number(row.date.slice(0, 4));
    if (year < startYear) return;
    latestNumeratorByYear.set(year, row);
  });

  return [...latestNumeratorByYear.entries()]
    .map(([year, row]) => {
      const denominator = findLatestObservationOnOrBefore(denominatorRows, row.date);
      if (!denominator) return null;
      return {
        y: String(year),
        v: roundValue((row.parsed / denominator.parsed) * 100, 1),
      };
    })
    .filter(Boolean);
}

function periodFromDate(date) {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `${year}-Q${quarter}`;
}

function shortQuarterLabel(period, isEstimate = false) {
  const [yearPart, quarterPart] = period.split("-Q");
  return `Q${quarterPart}'${yearPart.slice(2)}${isEstimate ? "E" : ""}`;
}

function parseQuarterPeriod(period) {
  const match = period?.match(/^(\d{4})-Q([1-4])$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    quarter: Number(match[2]),
  };
}

function compareQuarterPeriods(left, right) {
  const a = parseQuarterPeriod(left);
  const b = parseQuarterPeriod(right);
  if (!a || !b) return 0;
  if (a.year !== b.year) return a.year - b.year;
  return a.quarter - b.quarter;
}

async function fetchM2RatioHistory() {
  const [m2Rows, gdpRows] = await Promise.all([
    fetchFredSeriesHistory(FRED_SERIES.m2.series, FRED_SERIES.m2.parse),
    fetchFredSeriesHistory(FRED_SERIES.gdp.series, FRED_SERIES.gdp.parse),
  ]);

  return buildAnnualRatioHistory({
    numeratorRows: m2Rows,
    denominatorRows: gdpRows,
    startYear: 1990,
  });
}

async function fetchFedBalanceSheetRatioHistory() {
  const [walclRows, gdpRows] = await Promise.all([
    fetchFredSeriesHistory(FRED_SERIES.walcl.series, FRED_SERIES.walcl.parse),
    fetchFredSeriesHistory(FRED_SERIES.gdp.series, FRED_SERIES.gdp.parse),
  ]);

  return buildAnnualRatioHistory({
    numeratorRows: walclRows,
    denominatorRows: gdpRows,
    startYear: 2002,
  });
}

async function fetchMultplEarningsGrowthHistory() {
  const html = await fetchText("https://www.multpl.com/s-p-500-earnings-growth/table/by-quarter");
  const rows = [...html.matchAll(/<tr class="(?:odd|even)">\s*<td>([^<]+)<\/td>\s*<td>\s*(?:&#x2002;)?\s*(-?[\d.]+)%\s*<\/td>/g)]
    .map((match) => ({
      date: new Date(`${match[1]} UTC`),
      value: parseFloat(match[2]),
    }))
    .filter((row) => !Number.isNaN(row.date.getTime()) && Number.isFinite(row.value) && row.date.getUTCFullYear() >= 1997)
    .sort((left, right) => left.date - right.date)
    .map((row) => {
      const isoDate = row.date.toISOString().slice(0, 10);
      const period = periodFromDate(isoDate);
      return {
        period,
        label: shortQuarterLabel(period),
        actual: roundValue(row.value, 2),
        estimate: null,
      };
    });

  return rows;
}

function extractEarningsEstimatePointFromYardeni(html, checkedAt) {
  const normalized = normalizeScrapeText(html);
  const match = normalized.match(
    /consensus proforma (Q[1-4]) earnings growth forecast[\s\S]{0,220}?(?:weakened|improved|rose|fell)\s+to\s+([0-9]+(?:\.[0-9]+)?)%/i,
  ) || normalized.match(
    /(Q[1-4])[\s\S]{0,120}?earnings growth forecast[\s\S]{0,160}?(?:weakened|improved|rose|fell)\s+to\s+([0-9]+(?:\.[0-9]+)?)%/i,
  );
  if (!match) return null;

  const quarter = match[1];
  const value = parseFloat(match[2]);
  if (!Number.isFinite(value)) return null;

  const quarterYearMatch = normalized.match(new RegExp(`${quarter}-?(20\\d{2})`, "i"));
  const year = quarterYearMatch?.[1] ? Number(quarterYearMatch[1]) : new Date(checkedAt).getUTCFullYear();
  const quarterNumber = quarter.replace("Q", "");
  const period = `${year}-Q${quarterNumber}`;

  return {
    period,
    label: shortQuarterLabel(period, true),
    actual: null,
    estimate: roundValue(value, 2),
  };
}

async function fetchEarningsGrowthHistory() {
  const checkedAt = new Date().toISOString();
  const [actualRows, yardeniHtml] = await Promise.all([
    fetchMultplEarningsGrowthHistory(),
    fetchText("https://archive.yardeni.com/morning-briefing-2026/"),
  ]);

  const estimatePoint = extractEarningsEstimatePointFromYardeni(yardeniHtml, checkedAt);
  if (!estimatePoint || !actualRows.length) return actualRows;

  const history = actualRows.map((row) => ({ ...row }));
  const lastActual = history[history.length - 1];
  if (compareQuarterPeriods(estimatePoint.period, lastActual.period) > 0) {
    history[history.length - 1] = {
      ...lastActual,
      estimate: lastActual.actual,
    };
    history.push(estimatePoint);
  }

  return history;
}

function buildMetricPayload({
  value,
  display,
  chartValue,
  asOf,
  checkedAt,
  source,
  sourceUrl,
  frequency,
}) {
  return {
    value,
    display,
    chartValue: chartValue ?? value,
    asOf,
    checkedAt,
    source,
    sourceUrl,
    frequency,
  };
}

function extractMetricFromYardeni(html, patterns) {
  for (const pattern of patterns) {
    const matches = [...html.matchAll(pattern)];
    if (!matches.length) continue;
    const parsed = parseFloat(matches[0][1]);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

async function fetchYardeniSnapshot() {
  const checkedAt = new Date().toISOString();
  const normalized = normalizeScrapeText(
    await fetchText("https://archive.yardeni.com/morning-briefing-2026/"),
  );

  const forwardPe = extractMetricFromYardeni(normalized, [
    /S&P 500(?:'s)? forward P\/E of ([0-9]+(?:\.[0-9]+)?)/g,
    /S&P 500(?:'s)? forward P\/E, at ([0-9]+(?:\.[0-9]+)?)/g,
    /S&P 500(?:'s)? forward P\/E[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/g,
  ]);

  const epsGrowth = extractMetricFromYardeni(normalized, [
    /S&P 500(?:'s)? forward earnings growth(?: rate)? of ([0-9]+(?:\.[0-9]+)?)%/g,
    /S&P 500(?:'s)? earnings are expected to grow far more slowly, by ([0-9]+(?:\.[0-9]+)?)% this year/g,
    /S&P 500 \(([0-9]+(?:\.[0-9]+)?)% projected in 2026/g,
  ]);

  return {
    checkedAt,
    forwardPe: Number.isFinite(forwardPe)
      ? buildMetricPayload({
          value: forwardPe,
          display: forwardPe.toFixed(1),
          asOf: checkedAt.slice(0, 10),
          checkedAt,
          source: "Yardeni Research Morning Briefing",
          sourceUrl: "https://archive.yardeni.com/morning-briefing-2026/",
          frequency: "weekly",
        })
      : null,
    epsGrowth: Number.isFinite(epsGrowth)
      ? buildMetricPayload({
          value: epsGrowth,
          display: `${epsGrowth >= 0 ? "+" : ""}${epsGrowth.toFixed(1)}%`,
          asOf: checkedAt.slice(0, 10),
          checkedAt,
          source: "Yardeni Research Morning Briefing",
          sourceUrl: "https://archive.yardeni.com/morning-briefing-2026/",
          frequency: "weekly",
        })
      : null,
  };
}

async function fetchSlickchartsTop10() {
  const checkedAt = new Date().toISOString();
  const html = await fetchText("https://www.slickcharts.com/sp500");
  const end = html.indexOf("],totalMarketCap");
  const start = end >= 0 ? html.lastIndexOf('[{symbol:"', end) : -1;
  if (start < 0 || end < 0) throw new Error("Slickcharts payload was not found");

  const payload = html.slice(start, end + 1);
  const weights = [...payload.matchAll(/,weight:([0-9.]+)/g)].map((match) => Number(match[1]));
  if (weights.length < 10) throw new Error("Slickcharts payload did not include 10 weights");

  const concentration = weights.slice(0, 10).reduce((sum, value) => sum + value, 0);
  return buildMetricPayload({
    value: concentration,
    display: `${concentration.toFixed(1)}%`,
    asOf: checkedAt.slice(0, 10),
    checkedAt,
    source: "Slickcharts S&P 500",
    sourceUrl: "https://www.slickcharts.com/sp500",
    frequency: "daily",
  });
}

export async function fetchScrapedMetricValues() {
  const checkedAt = new Date().toISOString();
  const results = {};
  const errors = {};
  const yardeniSnapshotPromise = fetchYardeniSnapshot();
  const slickchartsPromise = fetchSlickchartsTop10();

  const operations = [
    {
      id: "cape",
      run: async () => {
        const html = await fetchText("https://www.multpl.com/shiller-pe");
        const value = extractFirstNumber(html, [/Current Shiller PE Ratio is ([\d.]+)/i]);
        if (!Number.isFinite(value)) throw new Error("Parser failed for cape");
        return buildMetricPayload({
          value,
          display: value.toFixed(1),
          asOf: checkedAt.slice(0, 10),
          checkedAt,
          source: "Multpl / Shiller",
          sourceUrl: "https://www.multpl.com/shiller-pe",
          frequency: "daily",
        });
      },
    },
    {
      id: "forwardPe",
      run: async () => {
        const yardeniSnapshot = await yardeniSnapshotPromise;
        if (!yardeniSnapshot.forwardPe) throw new Error("Parser failed for forwardPe");
        return yardeniSnapshot.forwardPe;
      },
    },
    {
      id: "buffett",
      run: async () => {
        const html = await fetchText("https://www.currentmarketvaluation.com/models/buffett-indicator.php");
        const value = extractFirstNumber(html, [/current Buffett Indicator value of ([\d.]+)%/i]);
        if (!Number.isFinite(value)) throw new Error("Parser failed for buffett");
        return buildMetricPayload({
          value,
          display: `${value.toFixed(0)}%`,
          asOf: checkedAt.slice(0, 10),
          checkedAt,
          source: "currentmarketvaluation.com",
          sourceUrl: "https://www.currentmarketvaluation.com/models/buffett-indicator.php",
          frequency: "daily",
        });
      },
    },
    {
      id: "top10Concentration",
      run: async () => slickchartsPromise,
    },
    {
      id: "marginDebt",
      run: async () => {
        const html = await fetchText("https://www.currentmarketvaluation.com/models/margin-debt.php");
        const billions = extractFirstNumber(html, [/margin debt of \$([\d,.]+)B/i, /margin debt.*?\$([\d,.]+)\s*billion/i]);
        const trillions = extractFirstNumber(html, [/margin debt.*?\$([\d,.]+)\s*trillion/i]);
        const value = Number.isFinite(trillions) ? trillions * 1000 : billions;
        if (!Number.isFinite(value)) throw new Error("Parser failed for marginDebt");
        return buildMetricPayload({
          value,
          display: value >= 1000 ? `$${(value / 1000).toFixed(2)}T` : `$${value.toFixed(0)}B`,
          asOf: checkedAt.slice(0, 10),
          checkedAt,
          source: "currentmarketvaluation.com",
          sourceUrl: "https://www.currentmarketvaluation.com/models/margin-debt.php",
          frequency: "monthly",
        });
      },
    },
    {
      id: "epsGrowth",
      run: async () => {
        const yardeniSnapshot = await yardeniSnapshotPromise;
        if (!yardeniSnapshot.epsGrowth) throw new Error("Parser failed for epsGrowth");
        return yardeniSnapshot.epsGrowth;
      },
    },
  ];

  const settled = await Promise.allSettled(
    operations.map(async (operation) => {
      results[operation.id] = await operation.run();
    }),
  );

  settled.forEach((result, index) => {
    if (result.status !== "rejected") return;
    errors[operations[index].id] = result.reason?.message ?? "Unknown scrape error";
  });

  return {
    checkedAt,
    results,
    errors,
  };
}

async function fetchBisGlobalDebtProxy() {
  const response = await fetch(BIS_TOTAL_CREDIT_ZIP_URL, { headers: DEFAULT_HEADERS });
  if (!response.ok) throw new Error(`BIS bulk download failed: HTTP ${response.status}`);

  const zipBuffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(zipBuffer);
  const entry = zip.getEntries()[0];
  if (!entry) throw new Error("BIS bulk download is empty");

  const csv = entry.getData().toString("utf8");
  const [headerLine] = csv.split(/\r?\n/, 1);
  const periods = headerLine.split(BIS_HEADER_SPLIT_TOKEN)[1]?.split(",") ?? [];
  const seriesLine = csv.split(/\r?\n/).find((line) => line.startsWith(BIS_PROXY_SERIES_PREFIX));

  if (!seriesLine) throw new Error("BIS proxy series not found");

  const values = seriesLine.slice(BIS_PROXY_SERIES_PREFIX.length).split(",");
  let lastIndex = -1;
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] !== "") {
      lastIndex = index;
      break;
    }
  }

  if (lastIndex < 0) throw new Error("BIS proxy series has no observations");

  const value = parseFloat(values[lastIndex]);
  if (!Number.isFinite(value)) throw new Error("BIS proxy latest observation is invalid");

  return {
    value,
    display: `${value.toFixed(1)}%`,
    chartValue: value,
    asOf: periods[lastIndex] ?? null,
    checkedAt: new Date().toISOString(),
    source: "BIS Total Credit - All reporting economies",
    sourceUrl: BIS_TOTAL_CREDIT_TOPIC_URL,
    frequency: "quarterly",
  };
}

function parseAsOfDate(value) {
  if (!value) return null;
  if (/^\d{4}-Q[1-4]$/.test(value)) {
    const [yearPart, quarterPart] = value.split("-Q");
    const quarter = Number(quarterPart);
    const month = quarter * 3;
    return new Date(Date.UTC(Number(yearPart), month, 0));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function assessMetric(metric, checkedAt) {
  const notes = [...metric.notes];
  let status = "ok";

  if (!Number.isFinite(metric.value)) {
    return {
      ...metric,
      status: "error",
      notes: [
        ...notes,
        ...(!notes.includes("No dynamic value was retrieved for this metric.")
          ? ["No dynamic value was retrieved for this metric."]
          : []),
      ],
    };
  }

  if (metric.min != null && metric.value < metric.min) {
    status = "error";
    notes.push(`Value ${metric.value} is below expected minimum ${metric.min}.`);
  }

  if (metric.max != null && metric.value > metric.max) {
    status = "error";
    notes.push(`Value ${metric.value} is above expected maximum ${metric.max}.`);
  }

  const parsedAsOf = parseAsOfDate(metric.asOf);
  const freshnessHours = FRESHNESS_HOURS[metric.freshness];
  if (parsedAsOf && freshnessHours) {
    const ageHours = (checkedAt.getTime() - parsedAsOf.getTime()) / (1000 * 60 * 60);
    if (ageHours > freshnessHours && status !== "error") {
      status = "warn";
      notes.push(`Data is stale for the expected ${metric.frequency} cadence.`);
    }
  } else if (!metric.asOf && status !== "error") {
    status = "warn";
    notes.push("No source as-of date is available for this metric.");
  }

  return {
    ...metric,
    status,
    notes,
  };
}

function summarizeMetrics(metrics) {
  const okCount = metrics.filter((metric) => metric.status === "ok").length;
  const warnCount = metrics.filter((metric) => metric.status === "warn").length;
  const errorCount = metrics.filter((metric) => metric.status === "error").length;
  const updatedCount = metrics.filter((metric) => Number.isFinite(metric.value)).length;

  return {
    status: errorCount > 0 ? "error" : warnCount > 0 ? "warn" : "ok",
    total: metrics.length,
    okCount,
    warnCount,
    errorCount,
    updatedCount,
  };
}

function formatIsoDate(date) {
  return date.toISOString();
}

export async function collectMetricsData() {
  const checkedAt = new Date();
  const metricStates = METRIC_REGISTRY.map(makeMetricState);
  const byId = Object.fromEntries(metricStates.map((metric) => [metric.id, metric]));

  let fredResults = {};
  let fredError = null;
  try {
    fredResults = await fetchAllFred();
  } catch (error) {
    fredError = error;
  }

  const markFredError = (metricId) => {
    const metric = byId[metricId];
    metric.notes.push(fredError?.message ?? "FRED data unavailable.");
  };

  if (!fredError) {
    applyMetricValue(byId.vix, {
      value: fredResults.vix.parsed,
      display: FRED_SERIES.vix.display(fredResults.vix.parsed),
      asOf: fredResults.vix.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.yieldCurve, {
      value: fredResults.yieldCurve.parsed,
      display: FRED_SERIES.yieldCurve.display(fredResults.yieldCurve.parsed),
      asOf: fredResults.yieldCurve.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.hySpread, {
      value: fredResults.hySpread.parsed,
      display: FRED_SERIES.hySpread.display(fredResults.hySpread.parsed),
      asOf: fredResults.hySpread.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.householdDebtIncome, {
      value: fredResults.householdDebtIncome.parsed,
      display: FRED_SERIES.householdDebtIncome.display(fredResults.householdDebtIncome.parsed),
      asOf: fredResults.householdDebtIncome.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.gdpGrowth, {
      value: fredResults.gdpGrowth.parsed,
      display: FRED_SERIES.gdpGrowth.display(fredResults.gdpGrowth.parsed),
      asOf: fredResults.gdpGrowth.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.fedFunds, {
      value: fredResults.fedFunds.parsed,
      display: FRED_SERIES.fedFunds.display(fredResults.fedFunds.parsed),
      chartValue: fredResults.fedFunds.parsed,
      asOf: fredResults.fedFunds.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    const gdp = fredResults.gdp.parsed;
    const m2Trillions = fredResults.m2.parsed;
    const m2Ratio = (m2Trillions / gdp) * 100;
    applyMetricValue(byId.m2, {
      value: m2Ratio,
      display: `$${m2Trillions.toFixed(1)}T`,
      chartValue: m2Trillions,
      asOf: fredResults.m2.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    const fedBalanceSheetTrillions = fredResults.walcl.parsed;
    const fedBalanceSheetRatio = (fedBalanceSheetTrillions / gdp) * 100;
    applyMetricValue(byId.fedBalanceSheet, {
      value: fedBalanceSheetRatio,
      display: `$${fedBalanceSheetTrillions.toFixed(1)}T`,
      chartValue: fedBalanceSheetTrillions,
      asOf: fredResults.walcl.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    applyMetricValue(byId.caseShiller, {
      value: fredResults.caseShiller.parsed,
      display: FRED_SERIES.caseShiller.display(fredResults.caseShiller.parsed),
      asOf: fredResults.caseShiller.date,
      checkedAt: formatIsoDate(checkedAt),
    });

    const capexGdpValue = (fredResults.pnfi.parsed / (gdp * 1000)) * 100;
    applyMetricValue(byId.capexGdp, {
      value: capexGdpValue,
      display: `${capexGdpValue.toFixed(1)}%`,
      asOf: fredResults.pnfi.date,
      checkedAt: formatIsoDate(checkedAt),
      dependencies: ["FRED PNFI", "FRED GDP"],
    });

    const capexOperatingCashFlowValue = (fredResults.pnfi.parsed / fredResults.corporateCashFlow.parsed) * 100;
    applyMetricValue(byId.capexOperatingCashFlow, {
      value: capexOperatingCashFlowValue,
      display: `${capexOperatingCashFlowValue.toFixed(0)}%`,
      asOf: fredResults.pnfi.date,
      checkedAt: formatIsoDate(checkedAt),
      dependencies: ["FRED PNFI", "FRED CNCF"],
    });
  } else {
    ["vix", "yieldCurve", "hySpread", "householdDebtIncome", "gdpGrowth", "fedFunds", "m2", "fedBalanceSheet", "caseShiller", "capexGdp", "capexOperatingCashFlow"].forEach(markFredError);
  }

  const { results: scrapedResults, errors: scrapeErrors, checkedAt: scrapeCheckedAt } = await fetchScrapedMetricValues();
  for (const [metricId, payload] of Object.entries(scrapedResults)) {
    applyMetricValue(byId[metricId], payload);
  }

  for (const metricId of SCRAPED_IDS) {
    if (!scrapedResults[metricId]) {
      byId[metricId].notes.push(
        scrapeErrors[metricId]
          ? `${scrapeErrors[metricId]} during the ${scrapeCheckedAt} run.`
          : `Scraper did not return a value during the ${scrapeCheckedAt} run.`,
      );
    }
  }

  if (!fredError && Number.isFinite(byId.forwardPe.value) && Number.isFinite(fredResults.treasury10y.parsed)) {
    const earningsYield = (1 / byId.forwardPe.value) * 100;
    const erpValue = earningsYield - fredResults.treasury10y.parsed;
    applyMetricValue(byId.erp, {
      value: erpValue,
      display: `${erpValue.toFixed(1)}%`,
      asOf: fredResults.treasury10y.date,
      checkedAt: formatIsoDate(checkedAt),
      dependencies: ["Forward P/E", "FRED DGS10"],
    });
  } else {
    byId.erp.notes.push("Could not derive ERP because Forward P/E or 10Y Treasury data is missing.");
  }

  if (!fredError && Number.isFinite(byId.marginDebt.value) && Number.isFinite(byId.buffett.value)) {
    const marketCapBillions = fredResults.gdp.parsed * 1000 * (byId.buffett.value / 100);
    const marginRatio = (byId.marginDebt.value / marketCapBillions) * 100;
    applyMetricValue(byId.marginDebtToMarketCap, {
      value: marginRatio,
      display: `${marginRatio.toFixed(2)}%`,
      asOf: byId.marginDebt.asOf,
      checkedAt: formatIsoDate(checkedAt),
      dependencies: ["FINRA Margin Debt", "Buffett Indicator", "FRED GDP"],
    });
  } else {
    byId.marginDebtToMarketCap.notes.push("Could not derive Margin Debt / Market Cap because one or more inputs are missing.");
  }

  try {
    applyMetricValue(byId.globalDebtProxy, await fetchBisGlobalDebtProxy());
  } catch (error) {
    byId.globalDebtProxy.notes.push(error.message);
  }

  const assessedMetrics = metricStates
    .map((metric) => assessMetric(metric, checkedAt))
    .sort((left, right) => left.idx - right.idx);

  const summary = summarizeMetrics(assessedMetrics);
  const [m2RatioHistory, fedBalanceSheetRatioHistory, earningsGrowthHistory] = await Promise.all([
    fetchM2RatioHistory().catch(() => []),
    fetchFedBalanceSheetRatioHistory().catch(() => []),
    fetchEarningsGrowthHistory().catch(() => []),
  ]);

  return {
    checkedAt: formatIsoDate(checkedAt),
    summary,
    metrics: assessedMetrics,
    histories: {
      m2Ratio: m2RatioHistory,
      fedBalanceSheetRatio: fedBalanceSheetRatioHistory,
      earningsGrowth: earningsGrowthHistory,
    },
  };
}

export function buildScrapedMetricsPayload(metricsData) {
  const scrapedMetrics = metricsData.metrics
    .filter((metric) => SCRAPED_IDS.has(metric.id) && Number.isFinite(metric.value))
    .reduce((acc, metric) => {
      acc[metric.id] = {
        value: metric.value,
        source: metric.source,
        metric: metric.name,
        idx: metric.idx,
      };
      return acc;
    }, {});

  return {
    timestamp: metricsData.checkedAt,
    count: Object.keys(scrapedMetrics).length,
    metrics: scrapedMetrics,
  };
}

export function formatAlertMessage(metricsData) {
  const failingMetrics = metricsData.metrics.filter((metric) => metric.status !== "ok");
  const lines = [
    `Bubble Risk Monitor health check: ${metricsData.summary.status.toUpperCase()}`,
    `Checked at: ${metricsData.checkedAt}`,
    `OK: ${metricsData.summary.okCount} | Warn: ${metricsData.summary.warnCount} | Error: ${metricsData.summary.errorCount}`,
  ];

  if (failingMetrics.length) {
    lines.push("");
    lines.push("Issues:");
    failingMetrics.forEach((metric) => {
      lines.push(`- ${metric.name}: ${metric.notes.join(" ") || metric.status}`);
    });
  }

  return lines.join("\n");
}

export async function postAlertIfConfigured(metricsData) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl || metricsData.summary.status === "ok") return false;

  const text = formatAlertMessage(metricsData);
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      content: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Alert webhook failed: HTTP ${response.status}`);
  }

  return true;
}
