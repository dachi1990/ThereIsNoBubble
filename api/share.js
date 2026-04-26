import { getShareChartBySlug } from "../src/chartShareRegistry.js";

const SITE_NAME = "There Is No Bubble";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const getOrigin = (req) => {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "www.thereisnobubble.com";
  return `${proto}://${host}`;
};

const getSlug = (req) => {
  if (typeof req.query?.slug === "string") return req.query.slug;
  const url = new URL(req.url || "/", "https://www.thereisnobubble.com");
  return url.searchParams.get("slug") || "";
};

export default function handler(req, res) {
  const slug = getSlug(req);
  const chart = getShareChartBySlug(slug);

  if (!chart) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(404).send(`<!doctype html><html><head><title>Chart not found</title></head><body>Chart not found.</body></html>`);
    return;
  }

  const origin = getOrigin(req);
  const shareUrl = `${origin}/share/${encodeURIComponent(chart.slug)}`;
  const targetUrl = `${origin}${chart.tabPath}#${encodeURIComponent(chart.anchorId)}`;
  const imageUrl = `${origin}/api/og-chart?slug=${encodeURIComponent(chart.slug)}`;
  const title = `${chart.title} | ${SITE_NAME}`;
  const description = `${chart.stat} - ${chart.comparison}. ${chart.description}`;
  const imageAlt = `${chart.title} chart preview from ${SITE_NAME}`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(shareUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:url" content="${escapeHtml(shareUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />
    <script>
      window.location.replace(${JSON.stringify(targetUrl)});
    </script>
  </head>
  <body style="font-family: system-ui, sans-serif; margin: 40px; color: #1a1916;">
    <h1>${escapeHtml(chart.title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p><a href="${escapeHtml(targetUrl)}">Open this chart</a></p>
  </body>
</html>`);
}
