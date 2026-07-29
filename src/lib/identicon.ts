import { hashString, mulberry32 } from "../data/market-sim/rng";

/**
 * Deterministic 5x5 symmetric identicon as an SVG data URI, seeded from a
 * wallet handle. No network, no deps.
 */
export function identiconDataUri(handle: string, size = 5): string {
  const rand = mulberry32(hashString(`icon:${handle}`));
  const hue = Math.floor(rand() * 360);
  const fg = `hsl(${hue} 70% 60%)`;
  const bg = "#141726";
  const half = Math.ceil(size / 2);
  let rects = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      if (rand() > 0.5) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        const mx = size - 1 - x;
        if (mx !== x) {
          rects += `<rect x="${mx}" y="${y}" width="1" height="1"/>`;
        }
      }
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="${bg}"/>` +
    `<g fill="${fg}">${rects}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
