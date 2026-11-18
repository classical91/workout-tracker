import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { T } from "../theme.js";
import { stretchCheckKey, stretchSections, summarizeStretchSession } from "./stretches.js";
import {
  summarizeWorkoutSession,
  workouts as builtInWorkouts,
  workoutUnitKeys,
} from "./workouts.js";
import { foamTech } from "./foamRoller.js";
import { simpleEx } from "./simpleExercises.js";

// Every checkmark in the app belongs to one "live log group": the stretch
// routine, one workout, the foam-roller routine, or a single simple exercise.
// Each group keeps one log entry per day that mirrors exactly what is checked,
// so ticking a box shows up in the log straight away and unticking it takes it
// back out. These builders turn the checked keys of a group into that entry.

export const STRETCH_GROUP = "stretch";
export const FOAM_GROUP = "foam";
export const workoutGroupId = (workoutId) => `workout:${workoutId}`;
export const simpleGroupId = (slug) => `simple:${slug}`;

export const foamCheckKey = (index) => `foam-${index}`;
export const simpleCheckKey = (index) => `sim-${index}`;

const allStretchItems = stretchSections.flatMap((section) => section.items);

export function buildStretchActivity(summary) {
  return {
    type: ACTIVITY_TYPES.STRETCH,
    category: ACTIVITY_CATEGORIES.MOBILITY,
    name: summary.name,
    emoji: "🧘",
    color: T.green,
    duration: summary.fullBody ? "10 min" : "",
    completed: summary.fullBody,
    details: {
      bodyAreas: summary.doneItems.map((item) => item.name),
      completedSections: summary.completedSections,
      holds: summary.doneItems.map((item) => ({
        name: item.name,
        planned: item.hold,
        region: item.region,
        color: item.color,
      })),
    },
  };
}

// The log entry writes itself from the plan: every exercise carries the sets
// actually ticked off and the reps they were planned at, so there is nothing to
// re-enter afterwards.
export function buildWorkoutActivity(workout, summary) {
  return {
    type: ACTIVITY_TYPES.WORKOUT,
    category: ACTIVITY_CATEGORIES.STRENGTH,
    name: summary.name,
    emoji: workout.emoji,
    color: workout.color,
    duration: summary.complete ? "~30 min" : "",
    completed: summary.complete,
    details: {
      workoutId: workout.id,
      completedSteps: summary.doneCount,
      totalSteps: summary.totalCount,
      completedSets: summary.doneUnits,
      exercises: summary.doneExercises.map((step) => ({
        name: step.phase,
        setCount: step.doneCount,
        plannedSets: step.plan.setCount,
        reps: step.plan.repCount,
      })),
    },
  };
}

export function buildFoamActivity(checked) {
  const done = foamTech.filter((_, index) => checked[foamCheckKey(index)]);
  const complete = done.length === foamTech.length;
  return {
    type: ACTIVITY_TYPES.FOAM_ROLLING,
    category: ACTIVITY_CATEGORIES.RECOVERY,
    name: complete ? "Foam Rolling" : "Foam Rolling (Partial)",
    emoji: "🧴",
    color: T.teal,
    duration: complete ? "10 min" : "",
    completed: complete,
    details: { bodyAreas: done.map((technique) => technique.area) },
  };
}

export function buildSimpleActivity(exercise) {
  return {
    type: ACTIVITY_TYPES.EXERCISE,
    category: ACTIVITY_CATEGORIES.STRENGTH,
    name: exercise.name,
    emoji: "🏃",
    color: T.blue,
    duration: "",
    completed: true,
    details: { exercises: [{ name: exercise.name, planned: exercise.reps }] },
  };
}

// Every group the app tracks, given the user's custom routines and set plans.
// `keys` are the checkmark keys that belong to the group; `build` receives only
// the checked ones and returns the log entry for them.
export function buildLiveLogGroups({ customWorkouts = [], plans = {} } = {}) {
  const stretch = {
    id: STRETCH_GROUP,
    keys: allStretchItems.map(stretchCheckKey),
    build: (checked) => buildStretchActivity(summarizeStretchSession(checked)),
  };
  const workoutGroups = [...builtInWorkouts, ...customWorkouts].map((workout) => ({
    id: workoutGroupId(workout.id),
    keys: workoutUnitKeys(workout, plans),
    build: (checked) =>
      buildWorkoutActivity(workout, summarizeWorkoutSession(workout, checked, plans)),
  }));
  const foam = {
    id: FOAM_GROUP,
    keys: foamTech.map((_, index) => foamCheckKey(index)),
    build: buildFoamActivity,
  };
  const simpleGroups = simpleEx.map((exercise, index) => ({
    id: simpleGroupId(exercise.slug),
    keys: [simpleCheckKey(index)],
    build: () => buildSimpleActivity(exercise),
  }));
  return [stretch, ...workoutGroups, foam, ...simpleGroups];
}

// Checkmark key prefixes that reset at local midnight. Workout keys are cleared
// by prefix so checks orphaned by an edited or deleted routine go too.
export const DAILY_CHECK_PREFIXES = ["str-", "w-", "foam-", "sim-"];
