import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { renderHomeOgSvg } from "../api/_lib/og-home-image.js";
import { DEFAULT_COMPOSITE_SCORE } from "../api/_lib/composite-score.js";

const OUT = new URL("../public/", import.meta.url);
const outPath = (name) => fileURLToPath(new URL(name, OUT));
const colors = {
  paper: "#f7f4ee",
  card: "#ffffff",
  cardAlt: "#f2efe8",
  ink: "#1a1916",
  navy: "#1a2744",
  muted: "#555249",
  dim: "#8b877e",
  border: "#ddd9d0",
  grid: "#e8e4db",
  red: "#c53030",
  green: "#0d9668",
  orange: "#d97706",
  gold: "#c9a84c",
};

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="${colors.paper}"/>
  <rect x="5" y="5" width="54" height="54" rx="14" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
  <circle cx="48" cy="16" r="5.5" fill="${colors.red}"/>
  <path d="M17 41a15 15 0 0 1 30 0" fill="none" stroke="${colors.grid}" stroke-width="6" stroke-linecap="round"/>
  <path d="M17 41a15 15 0 0 1 24-12" fill="none" stroke="${colors.orange}" stroke-width="6" stroke-linecap="round"/>
  <path d="M32 41 39 24" fill="none" stroke="${colors.navy}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="41" r="4.2" fill="${colors.navy}"/>
  <path d="M17 49h30" stroke="${colors.border}" stroke-width="2" stroke-linecap="round"/>
</svg>`;


const manifest = {
  name: "There Is No Bubble",
  short_name: "No Bubble",
  description: "Bubble Risk Monitor across 20 market and macro indicators.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: colors.paper,
  theme_color: colors.navy,
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

await writeFile(new URL("favicon.svg", OUT), iconSvg);
await writeFile(new URL("site.webmanifest", OUT), `${JSON.stringify(manifest, null, 2)}\n`);
await sharp(Buffer.from(renderHomeOgSvg({ score: DEFAULT_COMPOSITE_SCORE }))).png().toFile(outPath("og-image.png"));

for (const size of [16, 32, 48]) {
  await sharp(Buffer.from(iconSvg)).resize(size, size).png().toFile(outPath(`favicon-${size}.png`));
}

await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(outPath("apple-touch-icon.png"));
await sharp(Buffer.from(iconSvg)).resize(192, 192).png().toFile(outPath("icon-192.png"));
await sharp(Buffer.from(iconSvg)).resize(512, 512).png().toFile(outPath("icon-512.png"));

console.log("Generated brand assets in public/");
