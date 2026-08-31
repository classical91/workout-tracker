export const RECOVERY_TOOLS = Object.freeze({
  FOAM_ROLLER: "foam_roller",
  MASSAGE_GUN: "massage_gun",
  ACUPRESSURE: "acupressure",
  COLD_THERAPY: "cold_therapy",
});

export const RECOVERY_REASONS = Object.freeze({
  DAILY_MOBILITY: "daily_mobility",
  TRAINED_MUSCLE: "trained_muscle",
  TIGHTNESS: "tightness",
  MUSCLE_KNOT: "muscle_knot",
  SORENESS: "soreness",
  HEAD_NECK_TENSION: "head_neck_tension",
});

export const BODY_CHECK_INS = [
  { id: "feeling_good", label: "Feeling good" },
  { id: "tight_stiff", label: "Tight / stiff" },
  { id: "muscle_knot", label: "I have a muscle knot" },
  { id: "sore", label: "Sore from training" },
  { id: "head_neck_tension", label: "Head / neck tension" },
];

export const BODY_REGIONS = [
  { id: "neck", label: "Neck", muscles: ["neck"] },
  { id: "traps", label: "Traps", muscles: ["traps"] },
  { id: "shoulders", label: "Shoulders", muscles: ["shoulders"] },
  { id: "upper_back", label: "Upper back", muscles: ["upper_back", "traps"] },
  { id: "lats", label: "Lats", muscles: ["lats"] },
  { id: "lower_back", label: "Lower back", muscles: ["lower_back"] },
  { id: "glutes", label: "Glutes", muscles: ["glutes"] },
  { id: "quads", label: "Quads", muscles: ["quads"] },
  { id: "hamstrings", label: "Hamstrings", muscles: ["hamstrings"] },
  { id: "calves", label: "Calves", muscles: ["calves"] },
  { id: "other", label: "Other", muscles: [] },
];

export const STRETCH_DURATIONS = Object.freeze({
  quick: { id: "quick", label: "5 min", minutes: 5 },
  standard: { id: "standard", label: "12 min", minutes: 12 },
  extended: { id: "extended", label: "22 min", minutes: 22 },
});

// Sunday is index 0 because Date#getDay() uses Sunday-first indexing.
export const WEEKLY_RECOVERY_ROTATION = [
  { stretchingType: "gentle", duration: "quick", tool: null },
  { stretchingType: "full_body", duration: "standard", tool: RECOVERY_TOOLS.FOAM_ROLLER },
  { stretchingType: "targeted", duration: "standard", tool: RECOVERY_TOOLS.MASSAGE_GUN },
  { stretchingType: "full_body", duration: "standard", tool: RECOVERY_TOOLS.ACUPRESSURE },
  { stretchingType: "targeted", duration: "standard", tool: RECOVERY_TOOLS.FOAM_ROLLER },
  { stretchingType: "full_body", duration: "standard", tool: RECOVERY_TOOLS.MASSAGE_GUN },
  { stretchingType: "full_body", duration: "extended", tool: RECOVERY_TOOLS.ACUPRESSURE },
];

export const RECOVERY_TOOL_CONFIG = {
  [RECOVERY_TOOLS.FOAM_ROLLER]: {
    label: "Foam Roll",
    emoji: "🧴",
    duration: "5 min",
    muscles: ["calves", "hamstrings", "quads", "glutes", "lats", "upper_back"],
    regions: ["calves", "hamstrings", "quads", "glutes", "lats", "upper_back"],
    blockedRegions: ["neck", "lower_back", "other"],
    instructions: [
      "Choose one or two relevant areas — no full-body routine needed.",
      "Roll slowly and pause briefly near a tight spot without forcing pressure.",
    ],
    safety: "Avoid aggressive pressure directly over joints, the neck, or the spine.",
  },
  [RECOVERY_TOOLS.MASSAGE_GUN]: {
    label: "Massage Gun",
    emoji: "🔋",
    duration: "2 min",
    muscles: [
      "chest",
      "shoulders",
      "triceps",
      "biceps",
      "traps",
      "lats",
      "upper_back",
      "glutes",
      "quads",
      "hamstrings",
      "calves",
    ],
    blockedRegions: ["neck", "lower_back", "other"],
    instructions: [
      "Use the lowest comfortable setting on surrounding muscle tissue.",
      "Keep the tool moving; stop if the area becomes painful or numb.",
    ],
    safety:
      "Never use on the skull/head, front or side of the neck, spine, joints, bones, or injured/swollen tissue.",
  },
  [RECOVERY_TOOLS.ACUPRESSURE]: {
    label: "Acupressure",
    emoji: "🎯",
    duration: "3 min",
    muscles: ["neck", "traps", "shoulders", "upper_back", "lats"],
    instructions: [
      "Use steady, comfortable pressure around the tense muscle for 20–30 seconds.",
      "Release slowly, breathe, then re-test the movement.",
    ],
    safety: "Pressure should feel tolerable, never sharp, electric, or painful.",
  },
  [RECOVERY_TOOLS.COLD_THERAPY]: {
    label: "Cold Therapy",
    emoji: "🧊",
    duration: "5–10 min",
    muscles: [],
    instructions: [
      "Wrap the cold pack in a thin protective layer.",
      "Use a short timer and check the skin regularly.",
    ],
    safety:
      "Do not place ice directly on skin or use prolonged exposure. Stop with numbness, burning, or skin discoloration.",
  },
};

const EXERCISE_MUSCLE_RULES = [
  { terms: ["curl"], muscles: ["biceps"] },
  { terms: ["tricep", "dip"], muscles: ["triceps", "chest"] },
  { terms: ["lunge", "step-up", "squat"], muscles: ["quads", "glutes", "hamstrings"] },
  { terms: ["calf"], muscles: ["calves"] },
  { terms: ["shoulder press", "lateral raise"], muscles: ["shoulders", "triceps"] },
  { terms: ["row", "reverse fly"], muscles: ["upper_back", "lats", "traps"] },
  { terms: ["chest press", "push-up"], muscles: ["chest", "triceps", "shoulders"] },
  { terms: ["shrug"], muscles: ["traps"] },
  { terms: ["sit-up", "twist", "plank", "crunch"], muscles: ["core"] },
  { terms: ["deadlift", "hinge"], muscles: ["hamstrings", "glutes", "lower_back"] },
];

export const STRETCH_LIBRARY = [
  { id: "neck", label: "Gentle neck mobility", muscles: ["neck", "traps"] },
  { id: "shoulder", label: "Cross-body shoulder stretch", muscles: ["shoulders", "traps"] },
  { id: "chest", label: "Chest opener", muscles: ["chest"] },
  { id: "arms", label: "Arm and triceps stretch", muscles: ["biceps", "triceps"] },
  { id: "upper_back", label: "Upper-back reach", muscles: ["upper_back", "lats", "traps"] },
  { id: "lower_back", label: "Child's pose", muscles: ["lower_back", "core"] },
  { id: "hips", label: "Hip and glute stretch", muscles: ["glutes"] },
  { id: "hamstrings", label: "Hamstring hinge", muscles: ["hamstrings"] },
  { id: "quads", label: "Standing quad stretch", muscles: ["quads"] },
  { id: "calves", label: "Wall calf stretch", muscles: ["calves"] },
];

export const KNOT_TREATMENT_SEQUENCES = Object.fromEntries(
  BODY_REGIONS.map((region) => [
    region.id,
    [
      `Start with gentle ${region.label.toLowerCase()} mobility and easy breathing.`,
      "Use a comfortable stretch — never force into pain.",
      "Apply light manual pressure around the tight spot for 20–30 seconds.",
      ...(region.id === "neck" || region.id === "lower_back" || region.id === "other"
        ? []
        : ["If comfortable, use a massage gun on surrounding muscle tissue — not bone or joints."]),
      "Release, move normally, and re-test how the area feels.",
    ],
  ])
);

export function musclesFromExercises(exercises = []) {
  const found = new Set();
  for (const exercise of exercises) {
    const name = String(
      typeof exercise === "string" ? exercise : exercise?.name || ""
    ).toLowerCase();
    for (const rule of EXERCISE_MUSCLE_RULES) {
      if (rule.terms.some((term) => name.includes(term))) {
        for (const muscle of rule.muscles) found.add(muscle);
      }
    }
  }
  return [...found];
}

export function stretchesForMuscles(muscles = [], limit = 4) {
  const wanted = new Set(muscles);
  const targeted = STRETCH_LIBRARY.filter((stretch) =>
    stretch.muscles.some((muscle) => wanted.has(muscle))
  );
  return (targeted.length ? targeted : STRETCH_LIBRARY).slice(0, limit);
}

export const bodyRegionById = (id) => BODY_REGIONS.find((region) => region.id === id);
