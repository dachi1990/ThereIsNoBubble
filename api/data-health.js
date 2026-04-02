import { collectMetricsData } from "./_lib/metric-pipeline.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const metricsData = await collectMetricsData();
    const hasErrors = metricsData.summary?.errorCount > 0;
    res.setHeader(
      "Cache-Control",
      hasErrors
        ? "s-maxage=0, no-store"
        : "s-maxage=300, stale-while-revalidate=900",
    );
    res.status(200).json(metricsData);
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=0, no-store");
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
