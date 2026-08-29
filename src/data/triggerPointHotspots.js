import { triggerPointSections } from "./triggerPoints.js";

// Where each hotspot sits on /trigger-points/body-map-overview.png, as a
// percentage of the *whole* artwork (both figures). Percentages rather than
// pixels so the dots stay put however the map is scaled, and the map component
// converts them to per-panel coordinates when the two views stack on a phone.
//
// `view` says which figure a hotspot belongs to; the artwork puts the anterior
// figure in the left half (x < 50) and the posterior figure in the right half.
// `side` is the person's own side, which is mirrored between the two views: on
// the anterior figure their right is on the viewer's left, on the posterior
// figure their left is on the viewer's left.
//
// These are approximate centres of the region a trigger point is commonly
// described in, not exact anatomical coordinates — tenderness moves around
// between people. Re-check them against the artwork if it is ever re-framed;
// scripts/optimize-trigger-point-map.mjs prints the same reminder.
const hotspotPositions = [
  // Head / neck
  { key: "suboccipitals", side: "left", view: "posterior", x: 73.0, y: 13.4 },
  { key: "suboccipitals", side: "right", view: "posterior", x: 75.6, y: 13.4 },
  { key: "upper-traps", side: "left", view: "posterior", x: 71.5, y: 18.6 },
  { key: "upper-traps", side: "left", view: "posterior", x: 69.6, y: 19.8 },
  { key: "upper-traps", side: "right", view: "posterior", x: 77.2, y: 18.6 },
  { key: "upper-traps", side: "right", view: "posterior", x: 79.1, y: 19.8 },
  { key: "levator-scapulae", side: "left", view: "posterior", x: 72.0, y: 20.9 },
  { key: "levator-scapulae", side: "right", view: "posterior", x: 76.8, y: 20.9 },

  // Shoulders / chest
  { key: "pec-major", side: "right", view: "anterior", x: 23.4, y: 24.6 },
  { key: "pec-major", side: "left", view: "anterior", x: 31.3, y: 24.6 },
  { key: "pec-minor", side: "right", view: "anterior", x: 22.8, y: 22.8 },
  { key: "pec-minor", side: "left", view: "anterior", x: 31.9, y: 22.8 },
  { key: "rear-delt", side: "left", view: "posterior", x: 65.8, y: 23.2 },
  { key: "rear-delt", side: "right", view: "posterior", x: 83.0, y: 23.2 },

  // Upper / mid back
  { key: "rhomboids", side: "left", view: "posterior", x: 73.0, y: 25.5 },
  { key: "rhomboids", side: "right", view: "posterior", x: 75.6, y: 25.5 },
  { key: "infraspinatus", side: "left", view: "posterior", x: 70.3, y: 25.5 },
  { key: "infraspinatus", side: "right", view: "posterior", x: 78.4, y: 25.5 },
  { key: "lats", side: "left", view: "posterior", x: 67.6, y: 28.6 },
  { key: "lats", side: "left", view: "posterior", x: 68.3, y: 31.5 },
  { key: "lats", side: "right", view: "posterior", x: 81.1, y: 28.6 },
  { key: "lats", side: "right", view: "posterior", x: 80.4, y: 31.5 },

  // Lower back / hips / glutes
  { key: "ql", side: "left", view: "posterior", x: 71.0, y: 36.6 },
  { key: "ql", side: "right", view: "posterior", x: 77.6, y: 36.6 },
  { key: "glute-med", side: "left", view: "posterior", x: 67.6, y: 41.4 },
  { key: "glute-med", side: "right", view: "posterior", x: 81.0, y: 41.4 },
  { key: "piriformis", side: "left", view: "posterior", x: 69.6, y: 43.0 },
  { key: "piriformis", side: "right", view: "posterior", x: 79.0, y: 43.0 },
  { key: "glute-max", side: "left", view: "posterior", x: 70.2, y: 45.2 },
  { key: "glute-max", side: "right", view: "posterior", x: 78.4, y: 45.2 },
  { key: "hip-flexors", side: "right", view: "anterior", x: 24.3, y: 44.3 },
  { key: "hip-flexors", side: "left", view: "anterior", x: 30.4, y: 44.3 },

  // Legs / feet
  { key: "quads", side: "right", view: "anterior", x: 19.8, y: 52.5 },
  { key: "quads", side: "right", view: "anterior", x: 21.8, y: 54.0 },
  { key: "quads", side: "right", view: "anterior", x: 24.3, y: 61.5 },
  { key: "quads", side: "left", view: "anterior", x: 34.8, y: 52.5 },
  { key: "quads", side: "left", view: "anterior", x: 32.9, y: 54.0 },
  { key: "quads", side: "left", view: "anterior", x: 30.4, y: 61.5 },
  { key: "hamstrings", side: "left", view: "posterior", x: 69.0, y: 55.0 },
  { key: "hamstrings", side: "left", view: "posterior", x: 69.6, y: 60.5 },
  { key: "hamstrings", side: "right", view: "posterior", x: 79.6, y: 55.0 },
  { key: "hamstrings", side: "right", view: "posterior", x: 79.0, y: 60.5 },
  { key: "calves", side: "left", view: "posterior", x: 67.5, y: 72.0 },
  { key: "calves", side: "left", view: "posterior", x: 66.9, y: 79.0 },
  { key: "calves", side: "right", view: "posterior", x: 81.2, y: 72.0 },
  { key: "calves", side: "right", view: "posterior", x: 81.6, y: 79.0 },
  { key: "tibialis", side: "right", view: "anterior", x: 21.0, y: 73.0 },
  { key: "tibialis", side: "left", view: "anterior", x: 33.5, y: 73.0 },
  // The plantar fascia is on the sole, so it is marked at the heel on the
  // posterior figure rather than on the top of the foot in the front view.
  { key: "plantar", side: "left", view: "posterior", x: 66.5, y: 92.0 },
  { key: "plantar", side: "right", view: "posterior", x: 80.4, y: 92.0 },
];

// The artwork's intrinsic size. Exported so the map can set it on the <img>
// and reserve the right box before the image loads.
export const MAP_IMAGE_WIDTH = 1086;
export const MAP_IMAGE_HEIGHT = 1448;

// Percentages within a single figure panel. The artwork splits cleanly down the
// middle, so the front view occupies 0–50% and the back view 50–100%.
export function hotspotPanelX(hotspot) {
  return hotspot.view === "anterior" ? hotspot.x * 2 : (hotspot.x - 50) * 2;
}

const itemsByKey = new Map(
  triggerPointSections.flatMap((section) =>
    section.items.map((item) => [item.key, { item, section }])
  )
);

const missing = hotspotPositions.filter(({ key }) => !itemsByKey.has(key));
if (missing.length > 0) {
  throw new Error(
    `Trigger point hotspots reference unknown keys: ${missing.map((h) => h.key).join(", ")}`
  );
}

// Numbered per muscle *and* side so the label a screen reader reads out
// ("Latissimus Dorsi, left hotspot 2") matches what someone counts on the map.
const perSideCounts = new Map();

export const triggerPointHotspots = hotspotPositions.map((position) => {
  const { item, section } = itemsByKey.get(position.key);
  const countKey = `${position.key}:${position.side}`;
  const index = (perSideCounts.get(countKey) ?? 0) + 1;
  perSideCounts.set(countKey, index);

  return {
    id: `${position.key}-${position.side}-${index}`,
    triggerPointKey: position.key,
    side: position.side,
    view: position.view,
    x: position.x,
    y: position.y,
    index,
    name: item.name,
    muscle: item.muscle,
    color: section.color,
    label: `${item.name}, ${position.side} hotspot ${index}`,
  };
});

// A finger-sized target for 50 dots on a phone-width map would swallow its
// neighbours, and whichever button came last in the DOM would win every tap in
// a cluster — the dot under your finger would not be the one that opened. So
// each target grows only until it is close to touching the nearest other
// hotspot: `1.6 x` the gap means a target reaches 0.8 of the way there and can
// never cover another dot's centre. The CSS clamps the result into a sensible
// pixel range, and sparse areas (feet, calves) reach the full 44px.
const TARGET_SPREAD = 1.6;
// One panel is half the artwork wide and its full height, so a step in y is
// this many times larger, in pixels, than the same step in x. Distances have to
// be compared in one unit — percent of panel width — or the vertical gaps read
// as far smaller than they are.
const PANEL_ASPECT = MAP_IMAGE_HEIGHT / (MAP_IMAGE_WIDTH / 2);

const nearestNeighbourGap = (hotspot, all) =>
  all.reduce((nearest, other) => {
    if (other.id === hotspot.id || other.view !== hotspot.view) return nearest;
    const dx = hotspotPanelX(hotspot) - hotspotPanelX(other);
    const dy = (hotspot.y - other.y) * PANEL_ASPECT;
    return Math.min(nearest, Math.hypot(dx, dy));
  }, Infinity);

triggerPointHotspots.forEach((hotspot, _index, all) => {
  const gap = nearestNeighbourGap(hotspot, all);
  hotspot.targetSize = Number.isFinite(gap) ? Number((gap * TARGET_SPREAD).toFixed(1)) : 100;
});

export const triggerPointHotspotsByKey = triggerPointHotspots.reduce((byKey, hotspot) => {
  byKey[hotspot.triggerPointKey] = [...(byKey[hotspot.triggerPointKey] ?? []), hotspot];
  return byKey;
}, {});

export function findTriggerPointHotspot(hotspotId) {
  return triggerPointHotspots.find((hotspot) => hotspot.id === hotspotId) ?? null;
}

