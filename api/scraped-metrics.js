// Vercel Serverless Function — scrapes 6 metrics not available on FRED
// Cached for 12 hours on Vercel's CDN (s-maxage), stale-while-revalidate for 24h

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400');

  const results = {};
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; BubbleRiskMonitor/1.0)' };

  // Helper: fetch text with timeout
  async function fetchText(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const r = await fetch(url, { headers, signal: controller.signal });
      return await r.text();
    } catch { return null; }
    finally { clearTimeout(timeout); }
  }

  // Helper: extract number from pattern match
  function extractNum(html, regex) {
    if (!html) return null;
    const m = html.match(regex);
    return m ? parseFloat(m[1]) : null;
  }

  // 1. Shiller CAPE — multpl.com
  try {
    const html = await fetchText('https://www.multpl.com/shiller-pe');
    const val = extractNum(html, /Current Shiller PE Ratio is ([\d.]+)/);
    if (val) results.cape = { value: val, source: 'multpl.com', metric: 'Shiller CAPE Ratio', idx: 0 };
  } catch {}

  // 2. Forward P/E — approximate from S&P 500 earnings yield on multpl.com
  //    Forward PE isn't directly on multpl, so we use currentmarketvaluation.com
  try {
    const html = await fetchText('https://www.currentmarketvaluation.com/models/price-earnings.php');
    const val = extractNum(html, /current forward PE.*?([\d.]+)/i) || extractNum(html, /forward.*?PE.*?([\d.]+)/i);
    if (val) results.fwdPe = { value: val, source: 'currentmarketvaluation.com', metric: 'Forward P/E', idx: 1 };
  } catch {}

  // 3. Buffett Indicator — currentmarketvaluation.com
  try {
    const html = await fetchText('https://www.currentmarketvaluation.com/models/buffett-indicator.php');
    const val = extractNum(html, /current Buffett Indicator value of ([\d.]+)%/);
    if (val) results.buffett = { value: val, source: 'currentmarketvaluation.com', metric: 'Buffett Indicator', idx: 2 };
  } catch {}

  // 5. Top 10 Concentration — harder to scrape; try currentmarketvaluation or compute from slickcharts
  try {
    const html = await fetchText('https://www.currentmarketvaluation.com/models/sp500-concentration.php');
    const val = extractNum(html, /top.?10.*?([\d.]+)%/i) || extractNum(html, /concentration.*?([\d.]+)%/i);
    if (val) results.top10 = { value: val, source: 'currentmarketvaluation.com', metric: 'Top 10 Concentration', idx: 4 };
  } catch {}

  // 6. FINRA Margin Debt — try currentmarketvaluation
  try {
    const html = await fetchText('https://www.currentmarketvaluation.com/models/margin-debt.php');
    // Look for current margin debt value in billions or trillions
    const valB = extractNum(html, /margin debt.*?\$([\d,.]+)\s*billion/i);
    const valT = extractNum(html, /margin debt.*?\$([\d,.]+)\s*trillion/i);
    const val = valT ? valT * 1000 : valB ? valB : null;
    if (val) results.marginDebt = { value: val, source: 'currentmarketvaluation.com', metric: 'FINRA Margin Debt', idx: 5 };
  } catch {}

  // 11. S&P 500 EPS Growth — try to scrape from macrotrends or currentmarketvaluation
  try {
    const html = await fetchText('https://www.currentmarketvaluation.com/models/sp500-earnings.php');
    const val = extractNum(html, /earnings growth.*?([\d.]+)%/i) || extractNum(html, /EPS.*?growth.*?([\d.]+)%/i);
    if (val) results.epsGrowth = { value: val, source: 'currentmarketvaluation.com', metric: 'S&P 500 EPS Growth', idx: 10 };
  } catch {}

  // Return whatever we got
  const timestamp = new Date().toISOString();
  res.status(200).json({
    timestamp,
    count: Object.keys(results).length,
    metrics: results,
  });
}
