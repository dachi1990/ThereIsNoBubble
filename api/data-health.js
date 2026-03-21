import { collectMetricsData } from "./_lib/metric-pipeline.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");

  try {
    const metricsData = await collectMetricsData();
    res.status(200).json(metricsData);
  } catch (error) {
    res.status(500).json({
      checkedAt: new Date().toISOString(),
      summary: {
        status: "error",
        total: 20,
        okCount: 0,
        warnCount: 0,
        errorCount: 20,
        updatedCount: 0,
      },
      metrics: [],
      error: error.message,
    });
  }
}
