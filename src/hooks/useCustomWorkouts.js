import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

// Routines that ship pre-loaded as custom (editable + deletable) workouts. They
// seed a fresh install only; once a user has saved any custom workouts of their
// own, that stored list wins and these are not re-added. Each uses a stable,
// non-timestamp `id` so its checklist progress keys stay consistent.
const DEFAULT_CUSTOM_WORKOUTS = [
  {
    id: "c-dumbbell-back",
    title: "Dumbbell Back Workout",
    color: "#378ADD",
    emoji: "🏋️",
    tag: "Custom 1",
    steps: [
      {
        phase: "Warm-Up",
        reps: "5–10 min",
        detail: "Light cardio plus arm and shoulder swings to loosen up",
        type: "warmup",
      },
      {
        phase: "Dumbbell Romanian Deadlift",
        reps: "4 × 8–12",
        detail:
          "Targets lower back, glutes & hamstrings — keep your back flat, push hips back and feel a stretch in the hamstrings",
        type: "exercise",
      },
      {
        phase: "One-Arm Dumbbell Row",
        reps: "4 × 10–12 / side",
        detail:
          "Targets lats, rhomboids & traps — pull elbow toward your hip and squeeze your shoulder blade at the top",
        type: "exercise",
      },
      {
        phase: "Chest-Supported Dumbbell Row",
        reps: "3 × 10–15",
        detail:
          "Targets middle back — lie face-down on an incline bench, pull elbows back and squeeze",
        type: "exercise",
      },
      {
        phase: "Dumbbell Pullover",
        reps: "3 × 12–15",
        detail:
          "Targets lats & serratus — lower slowly behind your head and think about stretching your lats",
        type: "exercise",
      },
      {
        phase: "Reverse Dumbbell Fly",
        reps: "3 × 12–15",
        detail:
          "Targets rear delts & upper back — keep a slight bend in the elbows and move slowly with control",
        type: "exercise",
      },
      {
        phase: "Dumbbell Shrugs",
        reps: "3 × 15–20",
        detail: "Targets upper traps — lift shoulders straight up and pause 1–2 sec at the top",
        type: "exercise",
      },
      {
        phase: "Finisher (Optional)",
        reps: "2 rounds",
        detail: "20-sec dumbbell row hold each side, then 15 reverse flies, then 20 shrugs",
        type: "exercise",
      },
      {
        phase: "Cool-Down",
        reps: "5–10 min",
        detail:
          "Stretch the lats and upper back. Progress by adding reps/sets, slowing the lowering phase (3–4 sec), cutting rest, or pausing at peak contraction",
        type: "cooldown",
      },
    ],
  },
];

// User-created workout routines, persisted in localStorage. Each routine has the
// same shape as a built-in workout (title, color, emoji, tag, steps) plus a
// stable `id` used to key per-step checklist progress so deleting one routine
// never shifts another routine's saved progress. A fresh install is seeded with
// DEFAULT_CUSTOM_WORKOUTS; these are fully editable and deletable like any other.
export function useCustomWorkouts() {
  const [customWorkouts, setCustomWorkouts, saveError] = useLocalStorage(
    STORAGE_KEYS.customWorkouts,
    DEFAULT_CUSTOM_WORKOUTS
  );

  const addWorkout = (workout) => {
    const id = `c${Date.now()}`;
    setCustomWorkouts((prev) => [...prev, { ...workout, id }]);
    return id;
  };

  // Replace a routine's editable fields in place, preserving its id (and thus
  // its checklist progress keys) and its position in the list.
  const updateWorkout = (id, workout) =>
    setCustomWorkouts((prev) => prev.map((w) => (w.id === id ? { ...workout, id } : w)));

  const deleteWorkout = (id) => setCustomWorkouts((prev) => prev.filter((w) => w.id !== id));

  return { customWorkouts, addWorkout, updateWorkout, deleteWorkout, saveError };
}
