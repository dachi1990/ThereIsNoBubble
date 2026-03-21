import { collectMetricsData, formatAlertMessage, postAlertIfConfigured } from "../api/_lib/metric-pipeline.js";

const shouldNotify = process.argv.includes("--notify");

try {
  const metricsData = await collectMetricsData();

  console.log(formatAlertMessage(metricsData));
  console.log("");

  metricsData.metrics
    .filter((metric) => metric.status !== "ok")
    .forEach((metric) => {
      console.log(`${metric.status.toUpperCase()} ${metric.name}`);
      metric.notes.forEach((note) => console.log(`  - ${note}`));
    });

  if (shouldNotify) {
    const alertSent = await postAlertIfConfigured(metricsData);
    if (alertSent) {
      console.log("");
      console.log("Alert webhook sent.");
    }
  }

  if (metricsData.summary.status === "error") {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
