const SCORE_CONFIG = [
  { idx: 0, fallback: 37.5, avg: 17.4, crisis: 44.2, dir: 1 },
  { idx: 1, fallback: 21.8, avg: 16.7, crisis: 25.5, dir: 1 },
  { idx: 2, fallback: 230, avg: 90, crisis: 148, dir: 1 },
  { idx: 3, fallback: 0.3, avg: 4.0, crisis: -0.5, dir: -1 },
  { idx: 4, fallback: 37.2, avg: 19, crisis: 27, dir: 1 },
  { idx: 5, fallback: 21.04, avg: 23.3, crisis: 33.92, dir: 1 },
  { idx: 6, fallback: 1.68, avg: 2.0, crisis: 2.7, dir: 1 },
  { idx: 7, fallback: 0.52, avg: 1.0, crisis: -0.5, dir: -1 },
  { idx: 8, fallback: 3.3, avg: 4.9, crisis: 2.0, dir: -1 },
  { idx: 9, fallback: 93, avg: 100, crisis: 133, dir: 1 },
  { idx: 10, fallback: 15.2, avg: 8, crisis: -30, dir: -1 },
  { idx: 11, fallback: 2.0, avg: 2.5, crisis: -4.3, dir: -1 },
  { idx: 12, fallback: 3.6, avg: 3.5, crisis: 6.5, dir: 1 },
  { idx: 13, fallback: 72, avg: 60, crisis: 93, dir: 1 },
  { idx: 14, fallback: 21.2, avg: 6, crisis: 37.8, dir: 1 },
  { idx: 15, fallback: 24.1, avg: 19, crisis: 10, dir: -1 },
  { idx: 16, fallback: 332.0, avg: 150, crisis: 305, dir: 1 },
  { idx: 17, fallback: 246.3, avg: 227.8, crisis: 285.0, dir: 1 },
  { idx: 18, fallback: 13.9, avg: 13.0, crisis: 14.6, dir: 1 },
  { idx: 19, fallback: 111.0, avg: 120.0, crisis: 142.3, dir: 1 },
];

export const DEFAULT_COMPOSITE_SCORE = 41;

export function riskScore(value, avg, crisis, dir) {
  const raw = dir === 1
    ? ((value - avg) / (crisis - avg)) * 100
    : ((avg - value) / (avg - crisis)) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function calculateCompositeScore(metrics = []) {
  const byIndex = new Map(metrics.map((metric) => [metric.idx, metric]));
  const scores = SCORE_CONFIG.map((config) => {
    const liveValue = byIndex.get(config.idx)?.value;
    const value = Number.isFinite(liveValue) ? liveValue : config.fallback;
    return riskScore(value, config.avg, config.crisis, config.dir);
  });

  if (!scores.length) return DEFAULT_COMPOSITE_SCORE;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}
