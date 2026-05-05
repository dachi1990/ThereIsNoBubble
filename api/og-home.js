import { collectMetricsData } from "./_lib/metric-pipeline.js";
import { calculateCompositeScore, DEFAULT_COMPOSITE_SCORE } from "./_lib/composite-score.js";
import { configureOgFonts } from "./_lib/og-fonts.js";
import { renderHomeOgSvg } from "./_lib/og-home-image.js";

const SCORE_TIMEOUT_MS = 3500;

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

export default async function handler(req, res) {
  let score = DEFAULT_COMPOSITE_SCORE;

  try {
    const metricsData = await withTimeout(collectMetricsData(), SCORE_TIMEOUT_MS);
    if (metricsData?.metrics) {
      score = calculateCompositeScore(metricsData.metrics);
    }
  } catch {
    // Keep the social card available even if a live data source is briefly unavailable.
  }

  try {
    configureOgFonts();
    const { default: sharp } = await import("sharp");
    const svg = renderHomeOgSvg({ score });
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=21600");
    res.status(200).send(png);
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=0, no-store");
    res.status(500).send(`Failed to generate home image: ${error.message}`);
  }
}
