import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";

export const quickActivities = [
  {
    id: "bike",
    type: ACTIVITY_TYPES.EXERCISE,
    category: ACTIVITY_CATEGORIES.CARDIO,
    name: "Biking",
    emoji: "🚴",
    color: "#378ADD",
    duration: "20 min",
    details: { exerciseName: "Biking" },
  },
  {
    id: "sauna",
    type: ACTIVITY_TYPES.SAUNA,
    category: ACTIVITY_CATEGORIES.HEAT,
    name: "Sauna",
    emoji: "🧖",
    color: "#E74C3C",
    duration: "20 min",
  },
  {
    id: "swim",
    type: ACTIVITY_TYPES.EXERCISE,
    category: ACTIVITY_CATEGORIES.CARDIO,
    name: "Swimming",
    emoji: "🏊",
    color: "#4ECDC4",
    duration: "30 min",
    details: { exerciseName: "Swimming" },
  },
  {
    id: "run",
    type: ACTIVITY_TYPES.EXERCISE,
    category: ACTIVITY_CATEGORIES.CARDIO,
    name: "Running",
    emoji: "🏃",
    color: "#FF6B35",
    duration: "20 min",
    details: { exerciseName: "Running" },
  },
];
