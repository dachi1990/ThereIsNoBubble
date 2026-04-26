import { collectMetricsData, formatAlertMessage, postAlertIfConfigured } from "../api/_lib/metric-pipeline.js";

const shouldNotify = process.argv.includes("--notify");
const urlArg = process.argv.find((arg) => arg.startsWith("--url="));
const DEFAULT_PRODUCTION_HEALTH_URL = "https://www.thereisnobubble.com/api/data-health";
const hasFredKey = process.env.FRED_API_KEY || process.env.VITE_FRED_API_KEY;
const shouldUseProductionHealth = process.env.GITHUB_ACTIONS === "true" && !hasFredKey;
const healthUrl = urlArg?.slice("--url=".length)
  || process.env.CHECK_METRICS_URL
  || (shouldUseProductionHealth ? DEFAULT_PRODUCTION_HEALTH_URL : "");

async function fetchMetricsData() {
  if (!healthUrl) return collectMetricsData();

  const response = await fetch(healthUrl, {
    headers: { Accept: "application/json" },
  });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Health endpoint returned ${contentType || "unknown content type"} instead of JSON.`);
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || `Health endpoint failed with HTTP ${response.status}`);
  }
  return payload;
}

try {
  const metricsData = await fetchMetricsData();

  console.log(formatAlertMessage(metricsData));
  if (healthUrl) console.log(`Source: ${healthUrl}`);
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
