const WIDTH = 1200;
const HEIGHT = 630;

const colors = {
  paper: "#f7f4ee",
  card: "#ffffff",
  ink: "#171614",
  navy: "#1a2744",
  muted: "#5b574f",
  dim: "#918c82",
  border: "#ddd9d0",
  grid: "#e8e4db",
  red: "#c53030",
  green: "#0d9668",
  orange: "#d97706",
};

const clampScore = (score) => Math.max(0, Math.min(100, score));

const chartPoints = (score) => [
  17, 19, 23, 28, 39, 55, 73, 88, 80, 63, 47, 35,
  29, 27, 34, 47, 62, 79, 70, 51, 36, 34, 38, score,
];

function smoothPath(points) {
  if (points.length < 2) return "";

  const path = [`M ${points[0][0]} ${points[0][1]}`];
  const tension = 0.72;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const following = points[index + 2] ?? next;

    const controlOne = [
      current[0] + ((next[0] - previous[0]) / 6) * tension,
      current[1] + ((next[1] - previous[1]) / 6) * tension,
    ];
    const controlTwo = [
      next[0] - ((following[0] - current[0]) / 6) * tension,
      next[1] - ((following[1] - current[1]) / 6) * tension,
    ];

    path.push(`C ${controlOne[0].toFixed(2)} ${controlOne[1].toFixed(2)} ${controlTwo[0].toFixed(2)} ${controlTwo[1].toFixed(2)} ${next[0]} ${next[1]}`);
  }

  return path.join(" ");
}

function pathFromScores(scores) {
  const chart = { x: 86, y: 270, w: 1028, h: 230 };
  const points = scores.map((score, index) => {
    const x = chart.x + (index / (scores.length - 1)) * chart.w;
    const y = chart.y + chart.h - (clampScore(score) / 100) * chart.h;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });

  const line = smoothPath(points);
  const area = `${line} L ${chart.x + chart.w} ${chart.y + chart.h} L ${chart.x} ${chart.y + chart.h} Z`;
  return { points, line, area, chart };
}

export function renderHomeOgSvg({ score = 41 } = {}) {
  const normalizedScore = Math.round(clampScore(score));
  const { points, line, area, chart } = pathFromScores(chartPoints(normalizedScore));
  const current = points[points.length - 1];
  const dotCom = points[7];
  const gfc = points[17];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="paperGlow" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fffdf8"/>
      <stop offset="0.58" stop-color="${colors.paper}"/>
      <stop offset="1" stop-color="#eee7da"/>
    </linearGradient>
    <linearGradient id="riskLine" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${colors.navy}"/>
      <stop offset="0.34" stop-color="${colors.red}"/>
      <stop offset="0.62" stop-color="${colors.orange}"/>
      <stop offset="1" stop-color="${colors.green}"/>
    </linearGradient>
    <linearGradient id="riskArea" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${colors.orange}" stop-opacity="0.20"/>
      <stop offset="0.52" stop-color="${colors.orange}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${colors.orange}" stop-opacity="0"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#1a1916" flood-opacity="0.10"/>
    </filter>
    <filter id="lineGlow" x="-20%" y="-80%" width="140%" height="260%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${colors.orange}" flood-opacity="0.20"/>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#paperGlow)"/>
  <path d="M0 114 H1200 M0 516 H1200 M86 0 V630 M1114 0 V630" stroke="${colors.border}" stroke-width="1.5" opacity="0.42"/>
  <circle cx="1060" cy="86" r="178" fill="${colors.navy}" opacity="0.035"/>

  <g transform="translate(86 78)">
    <circle cx="0" cy="-4" r="6.5" fill="${colors.red}"/>
    <text x="24" y="3" fill="${colors.dim}" font-size="17" font-family="Outfit, sans-serif" font-weight="800" letter-spacing="5">THEREISNOBUBBLE.COM</text>
    <text x="0" y="92" fill="${colors.ink}" font-size="78" font-family="Instrument Serif, serif" font-weight="400">Bubble Risk Monitor</text>
    <text x="2" y="132" fill="${colors.muted}" font-size="27" font-family="Outfit, sans-serif" font-weight="600">A live market dashboard for the AI cycle.</text>
  </g>

  <g filter="url(#softShadow)">
    <rect x="62" y="238" width="1076" height="316" rx="28" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
  </g>

  <g>
    <line x1="${chart.x}" y1="${chart.y + chart.h}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h}" stroke="${colors.border}" stroke-width="2"/>
    <line x1="${chart.x}" y1="${chart.y + chart.h * 0.5}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h * 0.5}" stroke="${colors.grid}" stroke-width="2" stroke-dasharray="9 12"/>
    <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x + chart.w}" y2="${chart.y}" stroke="${colors.grid}" stroke-width="2" stroke-dasharray="9 12"/>
    <path d="${line}" fill="none" stroke="${colors.navy}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round" opacity="0.045"/>
    <path d="${area}" fill="url(#riskArea)"/>
    <path d="${line}" fill="none" stroke="url(#riskLine)" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" filter="url(#lineGlow)"/>

    <circle cx="${dotCom[0]}" cy="${dotCom[1]}" r="11" fill="${colors.red}" stroke="${colors.card}" stroke-width="5"/>
    <text x="${dotCom[0]}" y="${dotCom[1] - 28}" text-anchor="middle" fill="${colors.red}" font-size="17" font-family="Outfit, sans-serif" font-weight="800" letter-spacing="2">2000</text>

    <circle cx="${gfc[0]}" cy="${gfc[1]}" r="11" fill="${colors.red}" stroke="${colors.card}" stroke-width="5"/>
    <text x="${gfc[0]}" y="${gfc[1] - 28}" text-anchor="middle" fill="${colors.red}" font-size="17" font-family="Outfit, sans-serif" font-weight="800" letter-spacing="2">2008</text>

    <circle cx="${current[0]}" cy="${current[1]}" r="16" fill="${colors.navy}" stroke="${colors.card}" stroke-width="6"/>
    <text x="${current[0] - 14}" y="${current[1] - 40}" text-anchor="end" fill="${colors.navy}" font-size="20" font-family="Outfit, sans-serif" font-weight="800" letter-spacing="2">NOW</text>
  </g>
</svg>`;
}
