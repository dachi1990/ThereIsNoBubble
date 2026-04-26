import sharp from "sharp";
import { getShareChartBySlug } from "../src/chartShareRegistry.js";

const WIDTH = 1200;
const HEIGHT = 630;
const SIGNAL_COLORS = {
  green: "#0d9668",
  yellow: "#d97706",
  red: "#c53030",
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const getSlug = (req) => {
  if (typeof req.query?.slug === "string") return req.query.slug;
  const url = new URL(req.url || "/", "https://www.thereisnobubble.com");
  return url.searchParams.get("slug") || "";
};

const formatSignal = (signal) => {
  if (signal === "green") return "HEALTHY";
  if (signal === "yellow") return "CAUTION";
  return "ELEVATED";
};

const buildLine = (values) => {
  const chart = { x: 84, y: 250, w: 1032, h: 250 };
  const finite = values.filter((value) => Number.isFinite(value));
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const pad = Math.max((max - min) * 0.12, 1);
  const low = min - pad;
  const high = max + pad;
  const range = high - low || 1;

  return finite.map((value, index) => {
    const x = chart.x + (finite.length === 1 ? 0 : (index / (finite.length - 1)) * chart.w);
    const y = chart.y + chart.h - ((value - low) / range) * chart.h;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });
};

const renderSvg = (chart) => {
  const color = SIGNAL_COLORS[chart.signal] || SIGNAL_COLORS.yellow;
  const points = buildLine(chart.points);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const baseY = 500;
  const area = `${points[0][0]},${baseY} ${polyline} ${points[points.length - 1][0]},${baseY}`;
  const label = `${chart.stat} - ${chart.comparison}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#f7f4ee"/>
  <rect x="42" y="38" width="1116" height="554" rx="32" fill="#ffffff" stroke="#ddd9d0" stroke-width="2"/>
  <text x="84" y="94" fill="#8b877e" font-size="22" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${escapeXml(chart.category.toUpperCase())}</text>
  <text x="84" y="154" fill="#1a1916" font-size="54" font-family="Georgia, serif">${escapeXml(chart.title)}</text>
  <text x="86" y="198" fill="#555249" font-size="26" font-family="Arial, sans-serif">${escapeXml(chart.subtitle)}</text>
  <rect x="930" y="82" width="172" height="44" rx="22" fill="${color}18" stroke="${color}" stroke-width="2"/>
  <circle cx="958" cy="104" r="7" fill="${color}"/>
  <text x="976" y="112" fill="${color}" font-size="18" font-family="Arial, sans-serif" font-weight="800" letter-spacing="3">${formatSignal(chart.signal)}</text>
  <line x1="84" y1="250" x2="1116" y2="250" stroke="#e8e4db" stroke-width="2" stroke-dasharray="7 10"/>
  <line x1="84" y1="375" x2="1116" y2="375" stroke="#e8e4db" stroke-width="2" stroke-dasharray="7 10"/>
  <line x1="84" y1="500" x2="1116" y2="500" stroke="#ddd9d0" stroke-width="2"/>
  <polygon points="${area}" fill="${color}" opacity="0.10"/>
  <polyline points="${polyline}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${points[points.length - 1][0]}" cy="${points[points.length - 1][1]}" r="12" fill="#1a2744" stroke="#ffffff" stroke-width="5"/>
  <rect x="84" y="516" width="1032" height="1" fill="#ddd9d0"/>
  <text x="84" y="566" fill="#1a1916" font-size="36" font-family="Arial, sans-serif" font-weight="800">${escapeXml(label)}</text>
  <text x="1000" y="566" fill="#8b877e" font-size="18" font-family="Arial, sans-serif" font-weight="700" text-anchor="end">thereisnobubble.com</text>
</svg>`;
};

export default async function handler(req, res) {
  const slug = getSlug(req);
  const chart = getShareChartBySlug(slug);

  if (!chart) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(404).send("Chart not found");
    return;
  }

  try {
    const svg = renderSvg(chart);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(png);
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=0, no-store");
    res.status(500).send(`Failed to generate chart image: ${error.message}`);
  }
}
