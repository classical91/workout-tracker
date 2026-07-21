export const ACTIVITY_TYPES = Object.freeze({
  WORKOUT: "workout",
  EXERCISE: "exercise",
  STRETCH: "stretch",
  BREATHING: "breathing",
  SAUNA: "sauna",
  COLD_SHOWER: "cold_shower",
  MEDITATION: "meditation",
  BODY_SCAN: "body_scan",
  FOAM_ROLLING: "foam_rolling",
  TRIGGER_POINTS: "trigger_points",
  REFLEXOLOGY: "reflexology",
  OHMING: "ohming",
  RECOVERY: "recovery",
  GENERAL: "general",
});

export const ACTIVITY_CATEGORIES = Object.freeze({
  STRENGTH: "strength",
  MOBILITY: "mobility",
  CARDIO: "cardio",
  BREATHING: "breathing",
  MINDFULNESS: "mindfulness",
  RECOVERY: "recovery",
  HEAT: "heat",
  COLD: "cold",
  GENERAL: "general",
});

export const ACTIVITY_FILTERS = Object.freeze([
  { value: "all", label: "All" },
  { value: ACTIVITY_CATEGORIES.STRENGTH, label: "Strength" },
  { value: ACTIVITY_CATEGORIES.MOBILITY, label: "Mobility" },
  { value: ACTIVITY_CATEGORIES.BREATHING, label: "Breathing" },
  { value: ACTIVITY_CATEGORIES.MINDFULNESS, label: "Mindfulness" },
  { value: ACTIVITY_CATEGORIES.RECOVERY, label: "Recovery" },
  { value: ACTIVITY_CATEGORIES.HEAT, label: "Heat" },
  { value: ACTIVITY_CATEGORIES.COLD, label: "Cold" },
]);

export const labelActivityValue = (value = "general") =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
