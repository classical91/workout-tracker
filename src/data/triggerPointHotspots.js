import { triggerPointSections } from "./triggerPoints.js";

// Exact intrinsic dimensions of the final supplied artwork. Hotspot centres are
// recorded in source-image pixels, then converted to percentages inside each
// crop panel. Keeping the measured source pixels here makes later audits against
// the baked-in glow centres straightforward without sacrificing responsive
// percentage positioning in the DOM.
export const MAP_IMAGE_WIDTH = 971;
export const MAP_IMAGE_HEIGHT = 1619;

// The body figures need tall, independently tappable panels on phones. The sole
// inset overlaps the figures' bottom rows in the original canvas, so it gets a
// dedicated crop instead of being split down the middle. CSS masks the small
// inset fragments in the two body crops without altering the supplied artwork.
export const MAP_PANELS = [
  {
    view: "anterior",
    label: "Front",
    alt: "Front view of the muscular anatomy, marked with trigger-point hotspots",
    x: 0,
    y: 0,
    width: 486,
    height: 1420,
  },
  {
    view: "posterior",
    label: "Back",
    alt: "Back view of the muscular anatomy, marked with trigger-point hotspots",
    x: 485,
    y: 0,
    width: 486,
    height: 1420,
  },
  {
    view: "plantar",
    label: "Foot / Plantar",
    alt: "Plantar view of the right foot, marked with three plantar-fascia hotspots",
    x: 430,
    y: 1275,
    width: 125,
    height: 344,
  },
];

const panelsByView = new Map(MAP_PANELS.map((panel) => [panel.view, panel]));

// Centres measured from the 971 x 1619 final PNG. The two bright anterior
// deltoid markers are deliberately omitted below because anterior deltoid is
// not one of the app's 19 curated myofascial regions (documented separately at
// the bottom of this file). Every other baked-in marker is interactive.
const hotspotPositions = [
  // Head / neck
  { key: "suboccipitals", side: "left", view: "posterior", sourceX: 702.5, sourceY: 221.1 },
  { key: "suboccipitals", side: "right", view: "posterior", sourceX: 734.9, sourceY: 221.3 },
  {
    key: "levator-scapulae",
    side: "bilateral",
    view: "posterior",
    sourceX: 718.1,
    sourceY: 266.8,
  },
  { key: "upper-traps", side: "left", view: "posterior", sourceX: 651.7, sourceY: 303.4 },
  { key: "upper-traps", side: "right", view: "posterior", sourceX: 792.7, sourceY: 304.0 },

  // Chest / shoulders
  { key: "pec-major", side: "right", view: "anterior", sourceX: 206.1, sourceY: 375.7 },
  { key: "pec-major", side: "left", view: "anterior", sourceX: 315.5, sourceY: 376.0 },
  { key: "pec-minor", side: "right", view: "anterior", sourceX: 176.9, sourceY: 400.4 },
  { key: "pec-minor", side: "left", view: "anterior", sourceX: 343.4, sourceY: 401.4 },
  { key: "rear-delt", side: "left", view: "posterior", sourceX: 564.0, sourceY: 370.5 },
  { key: "rear-delt", side: "right", view: "posterior", sourceX: 872.7, sourceY: 348.1 },
  { key: "rear-delt", side: "right", view: "posterior", sourceX: 878.3, sourceY: 370.6 },

  // Upper / mid back
  { key: "rhomboids", side: "left", view: "posterior", sourceX: 697.7, sourceY: 379.9 },
  { key: "rhomboids", side: "right", view: "posterior", sourceX: 741.4, sourceY: 380.0 },
  { key: "infraspinatus", side: "left", view: "posterior", sourceX: 629.0, sourceY: 400.7 },
  { key: "infraspinatus", side: "right", view: "posterior", sourceX: 813.7, sourceY: 400.0 },
  { key: "lats", side: "left", view: "posterior", sourceX: 656.7, sourceY: 522.2 },
  { key: "lats", side: "right", view: "posterior", sourceX: 777.5, sourceY: 522.2 },
  { key: "ql", side: "left", view: "posterior", sourceX: 660.2, sourceY: 583.7 },
  { key: "ql", side: "right", view: "posterior", sourceX: 774.9, sourceY: 584.1 },

  // Lower back / hips / glutes
  { key: "glute-med", side: "left", view: "posterior", sourceX: 662.0, sourceY: 659.3 },
  { key: "glute-med", side: "right", view: "posterior", sourceX: 775.7, sourceY: 659.0 },
  { key: "glute-max", side: "left", view: "posterior", sourceX: 629.6, sourceY: 733.2 },
  { key: "glute-max", side: "right", view: "posterior", sourceX: 809.7, sourceY: 733.9 },
  { key: "piriformis", side: "left", view: "posterior", sourceX: 669.6, sourceY: 747.7 },
  { key: "piriformis", side: "right", view: "posterior", sourceX: 768.7, sourceY: 748.1 },
  { key: "hip-flexors", side: "right", view: "anterior", sourceX: 188.7, sourceY: 625.6 },
  { key: "hip-flexors", side: "right", view: "anterior", sourceX: 189.5, sourceY: 642.8 },
  { key: "hip-flexors", side: "right", view: "anterior", sourceX: 192.4, sourceY: 668.6 },
  { key: "hip-flexors", side: "left", view: "anterior", sourceX: 323.2, sourceY: 626.5 },
  { key: "hip-flexors", side: "left", view: "anterior", sourceX: 315.2, sourceY: 654.2 },

  // Legs
  { key: "quads", side: "right", view: "anterior", sourceX: 166.5, sourceY: 826.7 },
  { key: "quads", side: "right", view: "anterior", sourceX: 185.2, sourceY: 877.2 },
  { key: "quads", side: "left", view: "anterior", sourceX: 345.5, sourceY: 827.2 },
  { key: "quads", side: "left", view: "anterior", sourceX: 328.5, sourceY: 878.3 },
  { key: "hamstrings", side: "left", view: "posterior", sourceX: 659.5, sourceY: 877.3 },
  { key: "hamstrings", side: "left", view: "posterior", sourceX: 629.5, sourceY: 899.0 },
  { key: "hamstrings", side: "right", view: "posterior", sourceX: 776.5, sourceY: 878.5 },
  { key: "hamstrings", side: "right", view: "posterior", sourceX: 806.7, sourceY: 899.9 },
  { key: "calves", side: "right", view: "anterior", sourceX: 145.8, sourceY: 1112.0 },
  { key: "calves", side: "right", view: "anterior", sourceX: 188.3, sourceY: 1135.4 },
  { key: "calves", side: "left", view: "anterior", sourceX: 364.2, sourceY: 1112.4 },
  { key: "calves", side: "left", view: "anterior", sourceX: 321.1, sourceY: 1135.2 },
  { key: "calves", side: "left", view: "posterior", sourceX: 654.8, sourceY: 1115.7 },
  { key: "calves", side: "left", view: "posterior", sourceX: 617.0, sourceY: 1141.7 },
  { key: "calves", side: "right", view: "posterior", sourceX: 778.1, sourceY: 1115.8 },
  { key: "calves", side: "right", view: "posterior", sourceX: 816.3, sourceY: 1142.3 },
  { key: "tibialis", side: "right", view: "anterior", sourceX: 153.5, sourceY: 1214.5 },
  { key: "tibialis", side: "right", view: "anterior", sourceX: 174.6, sourceY: 1238.6 },
  { key: "tibialis", side: "left", view: "anterior", sourceX: 338.9, sourceY: 1194.0 },
  { key: "tibialis", side: "left", view: "anterior", sourceX: 357.0, sourceY: 1215.0 },

  // The inset depicts a single right sole (the great toe is medial/viewer-left).
  { key: "plantar", side: "right", view: "plantar", sourceX: 493.5, sourceY: 1372.4 },
  { key: "plantar", side: "right", view: "plantar", sourceX: 492.9, sourceY: 1443.1 },
  { key: "plantar", side: "right", view: "plantar", sourceX: 492.0, sourceY: 1513.9 },
];

export const NON_INTERACTIVE_BAKED_DOTS = [
  {
    view: "anterior",
    sourceX: 134.5,
    sourceY: 349.0,
    reason: "Anterior deltoid is not one of the 19 curated regions",
  },
  {
    view: "anterior",
    sourceX: 382.5,
    sourceY: 352.0,
    reason: "Anterior deltoid is not one of the 19 curated regions",
  },
];

const itemsByKey = new Map(
  triggerPointSections.flatMap((section) =>
    section.items.map((item) => [item.key, { item, section }])
  )
);

const missing = hotspotPositions.filter(({ key }) => !itemsByKey.has(key));
if (missing.length > 0) {
  throw new Error(
    `Trigger point hotspots reference unknown keys: ${missing.map((hotspot) => hotspot.key).join(", ")}`
  );
}

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
    sourceX: position.sourceX,
    sourceY: position.sourceY,
    index,
    name: item.name,
    muscle: item.muscle,
    color: section.color,
    label: `${item.name}, ${position.side} hotspot ${index}`,
  };
});

export function hotspotPanelPosition(hotspot) {
  const panel = panelsByView.get(hotspot.view);
  if (!panel) throw new Error(`Unknown trigger-point map panel: ${hotspot.view}`);
  return {
    x: ((hotspot.sourceX - panel.x) / panel.width) * 100,
    y: ((hotspot.sourceY - panel.y) / panel.height) * 100,
  };
}

// Grow each circular target toward (but never over) its closest baked marker.
// Ignored anterior-deltoid markers participate in this calculation too, so no
// interactive target can cover their centres. CSS removes the old 20px minimum
// because a forced minimum would overlap dense clusters on a 320px viewport.
const TARGET_SPREAD = 1.5;
const allBakedCenters = [
  ...triggerPointHotspots,
  ...NON_INTERACTIVE_BAKED_DOTS.map((dot, index) => ({ ...dot, id: `ignored-${index + 1}` })),
];

const nearestNeighbourGap = (hotspot) => {
  const panel = panelsByView.get(hotspot.view);
  const point = hotspotPanelPosition(hotspot);
  return allBakedCenters.reduce((nearest, other) => {
    if (other.id === hotspot.id || other.view !== hotspot.view) return nearest;
    const otherPoint = hotspotPanelPosition(other);
    const dx = point.x - otherPoint.x;
    const dy = (point.y - otherPoint.y) * (panel.height / panel.width);
    return Math.min(nearest, Math.hypot(dx, dy));
  }, Infinity);
};

triggerPointHotspots.forEach((hotspot) => {
  const gap = nearestNeighbourGap(hotspot);
  hotspot.targetSize = Number.isFinite(gap) ? Number((gap * TARGET_SPREAD).toFixed(2)) : 100;
});

export const triggerPointHotspotsByKey = triggerPointHotspots.reduce((byKey, hotspot) => {
  byKey[hotspot.triggerPointKey] = [...(byKey[hotspot.triggerPointKey] ?? []), hotspot];
  return byKey;
}, {});

export function findTriggerPointHotspot(hotspotId) {
  return triggerPointHotspots.find((hotspot) => hotspot.id === hotspotId) ?? null;
}
