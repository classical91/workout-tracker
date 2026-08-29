// Re-encodes the trigger-point anatomy artwork into the three files the map
// component ships: AVIF and WebP for browsers that take them, plus a losslessly
// re-compressed PNG fallback. The source PNG that comes out of an art tool is
// typically ~2 MB, which is a slow first paint on a phone.
//
// sharp is deliberately not a project dependency — this runs by hand whenever
// the artwork changes, not on every install or build:
//
//   npm install --no-save sharp
//   node scripts/optimize-trigger-point-map.mjs path/to/new-artwork.png
//
// With no argument it re-encodes the PNG already in public/trigger-points/.
import { existsSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.join(process.cwd(), "public", "trigger-points");
const BASE = "body-map-overview";
const PNG = path.join(OUT_DIR, `${BASE}.png`);

const source = process.argv[2] ? path.resolve(process.argv[2]) : PNG;
if (!existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const input = await readFile(source);
console.log(`source ${path.relative(process.cwd(), source)} — ${kb(input.length)}`);

const { width, height } = await sharp(input).metadata();
console.log(`dimensions ${width}×${height}`);

const outputs = [
  [`${BASE}.avif`, (image) => image.avif({ quality: 60, effort: 6 })],
  [`${BASE}.webp`, (image) => image.webp({ quality: 80, effort: 6 })],
  // Lossless: the PNG is only reached by browsers without AVIF or WebP, so it
  // trades size for never degrading the fallback.
  [`${BASE}.png`, (image) => image.png({ compressionLevel: 9, effort: 10 })],
];

for (const [name, encode] of outputs) {
  const buffer = await encode(sharp(input)).toBuffer();
  const target = path.join(OUT_DIR, name);
  const before = existsSync(target) ? statSync(target).size : 0;
  await writeFile(target, buffer);
  console.log(`${name.padEnd(24)} ${kb(buffer.length)}${before ? ` (was ${kb(before)})` : ""}`);
}

console.log(
  "\nRemember: hotspot coordinates in src/data/triggerPointHotspots.js are tied to " +
    "this artwork's framing. Re-check them if the figures moved."
);
