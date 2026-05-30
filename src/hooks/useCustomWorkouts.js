import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

// User-created workout routines, persisted in localStorage. Each routine has the
// same shape as a built-in workout (title, color, emoji, tag, steps) plus a
// stable `id` used to key per-step checklist progress so deleting one routine
// never shifts another routine's saved progress.
export function useCustomWorkouts() {
  const [customWorkouts, setCustomWorkouts, saveError] = useLocalStorage(
    STORAGE_KEYS.customWorkouts,
    []
  );

  const addWorkout = (workout) => {
    const id = `c${Date.now()}`;
    setCustomWorkouts((prev) => [...prev, { ...workout, id }]);
    return id;
  };

  const deleteWorkout = (id) => setCustomWorkouts((prev) => prev.filter((w) => w.id !== id));

  return { customWorkouts, addWorkout, deleteWorkout, saveError };
}
