import { useCallback } from "react";
import { useSyncedDoc } from "./useSyncedDoc.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { clampRepCount, clampSetCount, workoutPlanKey } from "../data/workouts.js";

// How many sets and how many reps per set the user intends to do, per exercise.
// Stored as a flat map keyed by workout id + step index so it survives adding,
// editing, or deleting other routines, and synced so the numbers you set on
// your phone are there on your desktop.
export function useWorkoutPlans() {
  const [plans, setPlans, doc] = useSyncedDoc(STORAGE_KEYS.workoutPlans, {});

  const setPlan = useCallback(
    (workoutId, stepIndex, plan) =>
      setPlans((previous) => ({
        ...previous,
        [workoutPlanKey(workoutId, stepIndex)]: {
          setCount: clampSetCount(plan.setCount),
          repCount: clampRepCount(plan.repCount),
        },
      })),
    [setPlans]
  );

  // Drop every saved plan for one routine — used when a routine is edited or
  // deleted, so its steps don't inherit the previous line-up's numbers.
  const clearPlans = useCallback(
    (workoutId) =>
      setPlans((previous) => {
        const prefix = `${workoutId}::`;
        const next = Object.fromEntries(
          Object.entries(previous || {}).filter(([key]) => !key.startsWith(prefix))
        );
        return next;
      }),
    [setPlans]
  );

  return { plans: plans || {}, setPlan, clearPlans, doc, saveError: doc.saveError };
}
