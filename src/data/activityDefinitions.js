import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";

export const ACTIVITY_DEFINITIONS = Object.freeze({
  [ACTIVITY_TYPES.WORKOUT]: {
    label: "Workout",
    category: ACTIVITY_CATEGORIES.STRENGTH,
    emoji: "🏋️",
    color: "#FF6B35",
  },
  [ACTIVITY_TYPES.EXERCISE]: {
    label: "Exercise",
    category: ACTIVITY_CATEGORIES.STRENGTH,
    emoji: "💪",
    color: "#FF6B35",
  },
  [ACTIVITY_TYPES.STRETCH]: {
    label: "Stretching",
    category: ACTIVITY_CATEGORIES.MOBILITY,
    emoji: "🧘",
    color: "#2ECC71",
  },
  [ACTIVITY_TYPES.BREATHING]: {
    label: "Breathing",
    category: ACTIVITY_CATEGORIES.BREATHING,
    emoji: "🌬️",
    color: "#4ECDC4",
  },
  [ACTIVITY_TYPES.SAUNA]: {
    label: "Sauna",
    category: ACTIVITY_CATEGORIES.HEAT,
    emoji: "🧖",
    color: "#E74C3C",
  },
  [ACTIVITY_TYPES.COLD_SHOWER]: {
    label: "Cold Shower",
    category: ACTIVITY_CATEGORIES.COLD,
    emoji: "🚿",
    color: "#378ADD",
  },
  [ACTIVITY_TYPES.MEDITATION]: {
    label: "Meditation",
    category: ACTIVITY_CATEGORIES.MINDFULNESS,
    emoji: "🧘",
    color: "#C77DFF",
  },
  [ACTIVITY_TYPES.BODY_SCAN]: {
    label: "Body Scan",
    category: ACTIVITY_CATEGORIES.MINDFULNESS,
    emoji: "🛌",
    color: "#2ECC71",
  },
  [ACTIVITY_TYPES.FOAM_ROLLING]: {
    label: "Foam Rolling",
    category: ACTIVITY_CATEGORIES.RECOVERY,
    emoji: "🧴",
    color: "#4ECDC4",
  },
  [ACTIVITY_TYPES.TRIGGER_POINTS]: {
    label: "Trigger Points",
    category: ACTIVITY_CATEGORIES.RECOVERY,
    emoji: "🎯",
    color: "#E74C3C",
  },
  [ACTIVITY_TYPES.REFLEXOLOGY]: {
    label: "Reflexology",
    category: ACTIVITY_CATEGORIES.RECOVERY,
    emoji: "🖐️",
    color: "#4ECDC4",
  },
  [ACTIVITY_TYPES.OHMING]: {
    label: "Ohming",
    category: ACTIVITY_CATEGORIES.BREATHING,
    emoji: "🕉️",
    color: "#C77DFF",
  },
  [ACTIVITY_TYPES.RECOVERY]: {
    label: "Recovery",
    category: ACTIVITY_CATEGORIES.RECOVERY,
    emoji: "✨",
    color: "#4ECDC4",
  },
  [ACTIVITY_TYPES.GENERAL]: {
    label: "Activity",
    category: ACTIVITY_CATEGORIES.GENERAL,
    emoji: "✅",
    color: "#FFD93D",
  },
});

export function getActivityDefinition(type) {
  return ACTIVITY_DEFINITIONS[type] || ACTIVITY_DEFINITIONS[ACTIVITY_TYPES.GENERAL];
}
