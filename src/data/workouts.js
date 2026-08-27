// Every exercise carries a *plan*: how many sets you intend to do and how many
// reps per set. The plan is what you tick off — one checkmark per set — so the
// screen records the work as it happens instead of asking you to type it in
// afterwards. Warm-up and cool-down steps have no plan; they're a single check.

export const DEFAULT_SET_COUNT = 3;
export const DEFAULT_REP_COUNT = 12;
export const MAX_SET_COUNT = 12;
export const MAX_REP_COUNT = 500;

export const workouts = [
  {
    id: "builtin-1",
    title: "Upper & Lower Dumbbell",
    color: "#FF6B35",
    emoji: "💪",
    tag: "Workout 1",
    steps: [
      {
        phase: "Warm-Up",
        reps: "5–10 min",
        detail: "Light cardio — jogging in place or jumping jacks",
        type: "warmup",
      },
      {
        phase: "Bicep Curls",
        setCount: 3,
        repCount: 12,
        detail: "Curl dumbbells up to shoulder height, squeeze at the top",
        type: "exercise",
        image: "/workouts/workout-1/bicep-curls.png",
      },
      {
        phase: "Tricep Dips",
        setCount: 3,
        repCount: 12,
        detail: "Lower body slowly, keep elbows close to body",
        type: "exercise",
        image: "/workouts/workout-1/tricep-dips.png",
      },
      {
        phase: "Lunges",
        setCount: 3,
        repCount: 12,
        detail: "Step forward, lower back knee toward floor, alternate legs",
        type: "exercise",
        image: "/workouts/workout-1/lunges.png",
      },
      {
        phase: "Shoulder Press",
        setCount: 3,
        repCount: 12,
        detail: "Press dumbbells overhead from shoulder height",
        type: "exercise",
        image: "/workouts/workout-1/shoulder-press.png",
      },
      {
        phase: "Bent-over Rows",
        setCount: 3,
        repCount: 12,
        detail: "Hinge at hips, pull dumbbells to ribcage, squeeze back",
        type: "exercise",
        image: "/workouts/workout-1/bent-over-rows.png",
      },
      {
        phase: "Cool-Down",
        reps: "5–10 min",
        detail: "Stretching to improve flexibility & prevent soreness",
        type: "cooldown",
      },
    ],
  },
  {
    id: "builtin-2",
    title: "Core & Lower Body Burn",
    color: "#FFD93D",
    emoji: "🔥",
    tag: "Workout 2",
    steps: [
      {
        phase: "Warm-Up",
        reps: "5–10 min",
        detail: "Light cardio to prepare your body",
        type: "warmup",
      },
      {
        phase: "Standing Calf Raise",
        setCount: 3,
        repCount: 12,
        detail: "Rise onto toes slowly, hold 1 sec, lower back down",
        type: "exercise",
        image: "/workouts/workout-2/standing-calf-raise.png",
      },
      {
        phase: "Step-ups",
        setCount: 3,
        repCount: 12,
        detail: "Step up onto a sturdy surface, alternate legs",
        type: "exercise",
        image: "/workouts/workout-2/step-ups.png",
      },
      {
        phase: "Sit-ups",
        setCount: 3,
        repCount: 12,
        detail: "Hold dumbbell at chest, engage core on the way up",
        type: "exercise",
        image: "/workouts/workout-2/sit-ups.png",
      },
      {
        phase: "Russian Twists",
        setCount: 3,
        repCount: 12,
        detail: "Hold dumbbell, rotate torso side to side",
        type: "exercise",
        image: "/workouts/workout-2/russian-twists.png",
      },
      {
        phase: "Reverse Fly",
        setCount: 3,
        repCount: 12,
        detail: "Hinge forward, raise dumbbells out to sides",
        type: "exercise",
        image: "/workouts/workout-2/reverse-fly.png",
      },
      {
        phase: "Cool-Down",
        reps: "5–10 min",
        detail: "Stretching to relax muscles and promote recovery",
        type: "cooldown",
      },
    ],
  },
  {
    id: "builtin-3",
    title: "Total Body Tone-Up",
    color: "#C77DFF",
    emoji: "🧘",
    tag: "Workout 3",
    steps: [
      {
        phase: "Warm-Up",
        reps: "5–10 min",
        detail: "Light cardio to get warmed up",
        type: "warmup",
      },
      {
        phase: "Dumbbell Squats",
        setCount: 3,
        repCount: 12,
        detail: "Feet shoulder-width apart, sit back and down",
        type: "exercise",
        image: "/workouts/workout-3/dumbbell-squats.png",
      },
      {
        phase: "Chest Press",
        setCount: 3,
        repCount: 12,
        detail: "Lie on back, press dumbbells up from chest",
        type: "exercise",
        image: "/workouts/workout-3/chest-press.png",
      },
      {
        phase: "Lateral Raises",
        setCount: 3,
        repCount: 12,
        detail: "Raise arms out to sides to shoulder height",
        type: "exercise",
        image: "/workouts/workout-3/lateral-raises.png",
      },
      {
        phase: "Dumbbell Shrugs",
        setCount: 3,
        repCount: 12,
        detail: "Lift shoulders toward ears",
        type: "exercise",
        image: "/workouts/workout-3/dumbbell-shrugs.png",
      },
      {
        phase: "Cool-Down",
        reps: "5–10 min",
        detail: "Stretching to cool down and recover",
        type: "cooldown",
      },
    ],
  },
];

export const tsStyle = {
  warmup: { bg: "#0F1F1A", ac: "#4ECDC4" },
  exercise: { bg: "#16161A", ac: null },
  cooldown: { bg: "#0F0F1F", ac: "#4ECDC4" },
};

// Clamp a user-typed count to something a workout can actually contain. An
// empty or unparseable value falls back to the supplied default.
function clampCount(value, fallback, max) {
  if (value === "" || value == null) return fallback;
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(1, parsed));
}

export const clampSetCount = (value, fallback = DEFAULT_SET_COUNT) =>
  clampCount(value, fallback, MAX_SET_COUNT);
export const clampRepCount = (value, fallback = DEFAULT_REP_COUNT) =>
  clampCount(value, fallback, MAX_REP_COUNT);

// Routines saved before plans existed stored their target as free text
// ("3 × 12–15", "4 × 10–12 / side", "2 rounds"). Pull numbers back out of it so
// an existing custom routine keeps its intent instead of silently resetting.
export function parsePlanText(text) {
  const source = String(text || "");
  const pair = source.match(/(\d+)\s*[×x*]\s*(\d+)/i);
  if (pair) {
    return { setCount: clampSetCount(pair[1]), repCount: clampRepCount(pair[2]) };
  }
  const single = source.match(/(\d+)/);
  if (single) {
    return { setCount: clampSetCount(single[1]), repCount: DEFAULT_REP_COUNT };
  }
  return { setCount: DEFAULT_SET_COUNT, repCount: DEFAULT_REP_COUNT };
}

// The plan a step ships with, before any per-user override.
export function stepPlanDefaults(step) {
  if (!step || step.type !== "exercise") return null;
  if (step.setCount == null && step.repCount == null && step.reps) return parsePlanText(step.reps);
  return {
    setCount: clampSetCount(step.setCount),
    repCount: clampRepCount(step.repCount),
  };
}

// Bring a stored routine up to the current step shape, so a routine saved
// before plans existed renders (and checks off) exactly like a new one.
export function normalizeWorkout(workout) {
  if (!workout || !Array.isArray(workout.steps)) return workout;
  return {
    ...workout,
    steps: workout.steps.map((step) => {
      if (step.type !== "exercise") return step;
      // The old free-text target is replaced by the parsed plan.
      const next = { ...step, ...stepPlanDefaults(step) };
      delete next.reps;
      return next;
    }),
  };
}

export const normalizeWorkouts = (list) =>
  Array.isArray(list) ? list.map((workout) => normalizeWorkout(workout)) : [];

// Where a user's own sets/reps for one step live in the plan store. Keyed by
// workout id (not list position) so editing or deleting one routine never
// shifts another routine's saved plan.
export const workoutPlanKey = (workoutId, stepIndex) => `${workoutId}::${stepIndex}`;

// The plan actually in force for a step: what the user set, falling back to the
// routine's own numbers.
export function resolvePlan(workout, stepIndex, plans = {}) {
  const step = workout?.steps?.[stepIndex];
  const defaults = stepPlanDefaults(step);
  if (!defaults) return null;
  const override = plans?.[workoutPlanKey(workout.id, stepIndex)];
  if (!override) return defaults;
  return {
    setCount: clampSetCount(override.setCount, defaults.setCount),
    repCount: clampRepCount(override.repCount, defaults.repCount),
  };
}

// The badge shown on a step: "3 × 12" for an exercise, the step's own text
// ("5–10 min") for a warm-up or cool-down.
export function stepLabel(workout, stepIndex, plans = {}) {
  const step = workout?.steps?.[stepIndex];
  const plan = resolvePlan(workout, stepIndex, plans);
  if (!plan) return step?.reps || "";
  const unit = step?.repUnit ? ` ${step.repUnit}${plan.repCount === 1 ? "" : "s"}` : "";
  return `${plan.setCount} × ${plan.repCount}${unit}`;
}

// The checkmark key for a whole step (warm-up / cool-down).
export const workoutStepKey = (workoutId, stepIndex) => `w-${workoutId}-${stepIndex}`;
// The checkmark key for one set of one exercise. Every set of an exercise gets
// its own key, so finishing set 2 of 3 is recorded as exactly that.
export const workoutSetKey = (workoutId, stepIndex, setIndex) =>
  `w-${workoutId}-${stepIndex}-s${setIndex}`;

// Every key that has to be checked for a step to count as finished: one per set
// for an exercise, a single key for anything else.
export function stepUnitKeys(workout, stepIndex, plans = {}) {
  const plan = resolvePlan(workout, stepIndex, plans);
  if (!plan) return [workoutStepKey(workout.id, stepIndex)];
  return Array.from({ length: plan.setCount }, (_, setIndex) =>
    workoutSetKey(workout.id, stepIndex, setIndex)
  );
}

export function workoutUnitKeys(workout, plans = {}) {
  return workout.steps.flatMap((_, stepIndex) => stepUnitKeys(workout, stepIndex, plans));
}

// How far through a step the user is, counted in sets.
export function stepProgress(workout, stepIndex, checked = {}, plans = {}) {
  const keys = stepUnitKeys(workout, stepIndex, plans);
  const doneKeys = keys.filter((key) => Boolean(checked[key]));
  return {
    keys,
    doneKeys,
    doneCount: doneKeys.length,
    totalCount: keys.length,
    done: keys.length > 0 && doneKeys.length === keys.length,
    started: doneKeys.length > 0,
  };
}

// Describe whichever sets of a workout are currently checked so a session can be
// logged regardless of whether the whole routine was finished. `complete` is
// true only when every set of every step is done, and the name reflects that
// ("Upper & Lower Dumbbell" vs. "… (Partial)"). Only exercise steps are
// surfaced as loggable exercises — warm-up/cool-down count toward progress but
// aren't exercises to detail. Each logged exercise carries the sets actually
// checked and the reps planned for them, so the log fills itself in.
export function summarizeWorkoutSession(workout, checked = {}, plans = {}) {
  const steps = workout.steps.map((step, index) => {
    const progress = stepProgress(workout, index, checked, plans);
    return { ...step, index, ...progress, plan: resolvePlan(workout, index, plans) };
  });
  const doneSteps = steps.filter((step) => step.done);
  const totalUnits = steps.reduce((sum, step) => sum + step.totalCount, 0);
  const doneUnits = steps.reduce((sum, step) => sum + step.doneCount, 0);
  const exercises = steps.filter((step) => step.type === "exercise");
  // An exercise counts as worth logging once any of its sets is checked.
  const doneExercises = exercises.filter((step) => step.started);
  const complete = totalUnits > 0 && doneUnits === totalUnits;

  return {
    name: complete ? workout.title : `${workout.title} (Partial)`,
    complete,
    doneSteps,
    doneCount: doneSteps.length,
    totalCount: steps.length,
    doneUnits,
    totalUnits,
    doneExercises,
    totalExercises: exercises.length,
  };
}
