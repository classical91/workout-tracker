import { T } from "../theme.js";

// Reflexology maps pressure points on the hands and feet to areas of the body.
// Pressing or massaging a point is a relaxing, complementary self-care practice —
// it is not a medical treatment or a substitute for professional care.
export const reflexologyIntro =
  "Reflexology links spots on your hands and feet to areas of the body. The left and right sides differ — the right carries the liver, gallbladder and appendix; the left carries the heart and spleen. Gently press a point in small circles for 20–40 seconds. Tap any point to see what it maps to.";

// Region groupings keep related points color-coded across every chart.
export const reflexRegions = {
  head: { label: "Head & Sinuses", color: T.red },
  senses: { label: "Eyes & Ears", color: T.yellow },
  chest: { label: "Chest & Glands", color: T.blue },
  digestive: { label: "Digestive Organs", color: T.green },
  spine: { label: "Spine", color: T.teal },
  pelvic: { label: "Lower Body", color: T.purple },
};

// Coordinates are defined in a canonical RIGHT-side orientation against the
// silhouettes in ReflexologyChart.jsx (hand viewBox 0 0 200 250, foot 0 0 200 320).
// Left-side charts reuse the same data mirrored across x, with side-specific
// organs swapped in. The chart component flips the silhouette to match.
const mirror = (z) => ({ ...z, x: 200 - z.x });
const tag = (arr, prefix) => arr.map((z) => ({ ...z, key: `${prefix}-${z.key}` }));

// ---------------------------------------------------------------- HANDS ----
const handShared = [
  { key: "sinuses", name: "Sinuses", region: "head", area: "Fingertips", benefit: "Eased congestion, sinus pressure and headaches.", x: 100, y: 36, r: 11 },
  { key: "colds", name: "Colds & Nerves", region: "head", area: "Fingers", benefit: "Soothing point used for colds and frayed nerves.", x: 118, y: 74 },
  { key: "brain", name: "Brain", region: "head", area: "Thumb tip", benefit: "Calmer mind, relief from tension headaches.", x: 40, y: 108 },
  { key: "pituitary", name: "Pituitary Gland", region: "head", area: "Centre of thumb", benefit: "Associated with hormone and mood balance.", x: 50, y: 127 },
  { key: "pineal", name: "Pineal Gland", region: "head", area: "Inner upper palm", benefit: "Linked to sleep rhythm and relaxation.", x: 74, y: 140 },
  { key: "neck", name: "Neck & Throat", region: "head", area: "Around the base of the thumb", benefit: "Loosens neck tension and throat tightness.", x: 64, y: 164 },
  { key: "eyes", name: "Eyes", region: "senses", area: "Base of index & middle fingers", benefit: "Rest for tired, strained eyes.", x: 94, y: 106 },
  { key: "ears", name: "Ears", region: "senses", area: "Base of ring & little fingers", benefit: "Linked to ear pressure and balance.", x: 132, y: 110 },
  { key: "thyroid", name: "Thyroid & Parathyroid", region: "chest", area: "Base of index finger", benefit: "Associated with metabolism and energy.", x: 84, y: 122 },
  { key: "thymus", name: "Thymus", region: "chest", area: "Upper outer palm", benefit: "Linked to immune support.", x: 138, y: 126 },
  { key: "shoulder", name: "Shoulder", region: "chest", area: "Outer edge of palm", benefit: "Releases stiff, tight shoulders.", x: 148, y: 140 },
  { key: "solar-plexus", name: "Solar Plexus", region: "chest", area: "Centre of upper palm", benefit: "A calming point for stress and tension.", x: 106, y: 146 },
  { key: "lung", name: "Lungs", region: "chest", area: "Upper palm", benefit: "Supports easier, deeper breathing.", x: 96, y: 132 },
  { key: "stomach", name: "Stomach", region: "digestive", area: "Upper palm near thumb", benefit: "Eases an upset or tense stomach.", x: 78, y: 152 },
  { key: "adrenal", name: "Adrenal Gland", region: "digestive", area: "Mid palm", benefit: "Linked to energy and stress response.", x: 98, y: 162 },
  { key: "kidney", name: "Kidneys", region: "digestive", area: "Centre of palm", benefit: "Linked to fluid balance and energy.", x: 106, y: 172 },
  { key: "pancreas", name: "Pancreas", region: "digestive", area: "Inner mid palm", benefit: "Linked to blood-sugar balance.", x: 82, y: 172 },
  { key: "colon", name: "Colon", region: "digestive", area: "Lower-mid palm", benefit: "Supports regular, smoother digestion.", x: 114, y: 184 },
  { key: "intestines", name: "Intestines", region: "digestive", area: "Lower palm", benefit: "Supports smoother digestion.", x: 96, y: 188 },
  { key: "spine", name: "Spine", region: "spine", area: "Thumb-side edge / back of hand", benefit: "Helps release back tension top to bottom.", x: 70, y: 182 },
  { key: "bladder", name: "Bladder", region: "pelvic", area: "Heel of palm", benefit: "Linked to the lower urinary system.", x: 92, y: 202 },
  { key: "hip", name: "Hip", region: "pelvic", area: "Lower outer palm", benefit: "Eases hip and lower-back tightness.", x: 136, y: 196 },
  { key: "reproductive", name: "Ovaries / Testes", region: "pelvic", area: "Lower outer palm", benefit: "Associated with reproductive balance.", x: 140, y: 212 },
  { key: "pelvic-organs", name: "Uterus / Prostate", region: "pelvic", area: "Lower midline of palm", benefit: "Linked to the lower pelvic organs.", x: 102, y: 218 },
];

const handRightExtra = [
  { key: "liver", name: "Liver", region: "digestive", area: "Outer mid palm (right hand)", benefit: "Associated with digestion and detox.", x: 130, y: 162 },
  { key: "gallbladder", name: "Gall Bladder", region: "digestive", area: "Below the liver (right hand)", benefit: "Linked to fat digestion.", x: 132, y: 178 },
  { key: "appendix", name: "Appendix", region: "digestive", area: "Lower outer palm (right hand)", benefit: "Lower-right digestive point.", x: 120, y: 206 },
];

const handLeftExtra = [
  { key: "heart", name: "Heart", region: "chest", area: "Upper outer palm (left hand)", benefit: "A soothing, calming pressure point.", x: 132, y: 150 },
  { key: "spleen", name: "Spleen", region: "digestive", area: "Outer mid palm (left hand)", benefit: "Linked to immune support.", x: 134, y: 172 },
];

const handRight = tag([...handShared, ...handRightExtra], "hr");
const handLeft = tag([...handShared, ...handLeftExtra].map(mirror), "hl");

// ----------------------------------------------------------------- FEET ----
const footShared = [
  { key: "brain", name: "Brain", region: "head", area: "Big toe", benefit: "Calmer mind, relief from headaches.", x: 60, y: 40, r: 13 },
  { key: "glands", name: "Glands (Pituitary / Pineal)", region: "head", area: "Centre of big toe", benefit: "Associated with hormone balance.", x: 60, y: 62 },
  { key: "sinuses", name: "Sinuses", region: "head", area: "Tips of the small toes", benefit: "Eased congestion and sinus pressure.", x: 120, y: 42 },
  { key: "throat", name: "Nose & Throat", region: "head", area: "Base of big toe", benefit: "Loosens throat and neck tension.", x: 66, y: 82 },
  { key: "eye", name: "Eyes", region: "senses", area: "Base of 2nd & 3rd toes", benefit: "Rest for tired eyes.", x: 102, y: 80 },
  { key: "ear", name: "Ears", region: "senses", area: "Base of 4th & 5th toes", benefit: "Linked to ear pressure and balance.", x: 142, y: 86 },
  { key: "thalamus", name: "Thalamus / Thyroid", region: "chest", area: "Inner ball of foot", benefit: "Associated with metabolism and calm.", x: 74, y: 108 },
  { key: "lungs", name: "Lungs", region: "chest", area: "Ball of foot", benefit: "Supports easier, deeper breathing.", x: 100, y: 116 },
  { key: "shoulder", name: "Shoulder", region: "chest", area: "Outer ball of foot", benefit: "Releases tight shoulders.", x: 140, y: 116 },
  { key: "diaphragm", name: "Diaphragm", region: "chest", area: "Below the ball of foot", benefit: "Supports relaxed breathing.", x: 96, y: 132 },
  { key: "adrenals", name: "Adrenal Glands", region: "digestive", area: "Upper-mid arch", benefit: "Linked to energy and stress response.", x: 94, y: 150 },
  { key: "kidneys", name: "Kidneys", region: "digestive", area: "Centre of arch", benefit: "Linked to fluid balance and energy.", x: 100, y: 164 },
  { key: "spine", name: "Spine", region: "spine", area: "Inner edge of foot", benefit: "Helps release back tension top to bottom.", x: 58, y: 150 },
  { key: "small-intestine", name: "Small Intestine", region: "digestive", area: "Lower arch", benefit: "Supports smoother digestion.", x: 100, y: 196 },
  { key: "colon", name: "Colon", region: "digestive", area: "Outer arch", benefit: "Supports regular, smoother digestion.", x: 126, y: 188 },
  { key: "bladder", name: "Bladder", region: "pelvic", area: "Inner heel", benefit: "Linked to the lower urinary system.", x: 76, y: 216 },
  { key: "coccyx", name: "Coccyx", region: "pelvic", area: "Inner heel edge", benefit: "Eases tailbone and lower-back tension.", x: 64, y: 230 },
  { key: "pelvis", name: "Pelvis", region: "pelvic", area: "Heel", benefit: "Releases lower-back and hip tightness.", x: 100, y: 255 },
  { key: "sciatic", name: "Sciatic Nerve", region: "pelvic", area: "Across the heel", benefit: "Eases lower-leg and sciatic tension.", x: 104, y: 280 },
];

const footRightExtra = [
  { key: "liver", name: "Liver", region: "digestive", area: "Outer arch (right foot)", benefit: "Associated with digestion and detox.", x: 130, y: 150 },
  { key: "gallbladder", name: "Gall Bladder", region: "digestive", area: "Outer arch below liver (right foot)", benefit: "Linked to fat digestion.", x: 126, y: 166 },
  { key: "appendix", name: "Appendix", region: "digestive", area: "Lower outer arch (right foot)", benefit: "Lower-right digestive point.", x: 122, y: 205 },
];

const footLeftExtra = [
  { key: "heart", name: "Heart", region: "chest", area: "Upper inner sole (left foot)", benefit: "A soothing, calming pressure point.", x: 82, y: 128 },
  { key: "stomach", name: "Stomach", region: "digestive", area: "Inner arch (left foot)", benefit: "Eases an upset or tense stomach.", x: 84, y: 150 },
  { key: "pancreas", name: "Pancreas", region: "digestive", area: "Inner mid arch (left foot)", benefit: "Linked to blood-sugar balance.", x: 92, y: 166 },
  { key: "spleen", name: "Spleen", region: "digestive", area: "Outer arch (left foot)", benefit: "Linked to immune support.", x: 128, y: 158 },
];

const footRight = tag([...footShared, ...footRightExtra], "fr");
const footLeft = tag([...footShared, ...footLeftExtra].map(mirror), "fl");

// Charts indexed by type then body side (the person's own left / right).
export const reflexCharts = {
  hand: { right: handRight, left: handLeft },
  foot: { right: footRight, left: footLeft },
};
