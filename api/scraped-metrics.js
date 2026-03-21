import { buildScrapedMetricsPayload, collectMetricsData } from "./_lib/metric-pipeline.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400");

  try {
    const metricsData = await collectMetricsData();
    res.status(200).json(buildScrapedMetricsPayload(metricsData));
  } catch (error) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      count: 0,
      metrics: {},
      error: error.message,
    });
  }
}
