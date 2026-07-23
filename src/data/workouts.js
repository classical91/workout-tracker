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
        reps: "3 × 12–15",
        detail: "Curl dumbbells up to shoulder height, squeeze at the top",
        type: "exercise",
      },
      {
        phase: "Tricep Dips",
        reps: "3 × 12–15",
        detail: "Lower body slowly, keep elbows close to body",
        type: "exercise",
      },
      {
        phase: "Lunges",
        reps: "3 × 12–15",
        detail: "Step forward, lower back knee toward floor, alternate legs",
        type: "exercise",
      },
      {
        phase: "Shoulder Press",
        reps: "3 × 12–15",
        detail: "Press dumbbells overhead from shoulder height",
        type: "exercise",
      },
      {
        phase: "Bent-over Rows",
        reps: "3 × 12–15",
        detail: "Hinge at hips, pull dumbbells to ribcage, squeeze back",
        type: "exercise",
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
        reps: "3 × 12–15",
        detail: "Rise onto toes slowly, hold 1 sec, lower back down",
        type: "exercise",
      },
      {
        phase: "Step-ups",
        reps: "3 × 12–15",
        detail: "Step up onto a sturdy surface, alternate legs",
        type: "exercise",
      },
      {
        phase: "Sit-ups",
        reps: "3 × 12–15",
        detail: "Hold dumbbell at chest, engage core on the way up",
        type: "exercise",
      },
      {
        phase: "Russian Twists",
        reps: "3 × 12–15",
        detail: "Hold dumbbell, rotate torso side to side",
        type: "exercise",
      },
      {
        phase: "Reverse Fly",
        reps: "3 × 12–15",
        detail: "Hinge forward, raise dumbbells out to sides",
        type: "exercise",
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
        reps: "3 × 12–15",
        detail: "Feet shoulder-width apart, sit back and down",
        type: "exercise",
      },
      {
        phase: "Chest Press",
        reps: "3 × 12–15",
        detail: "Lie on back, press dumbbells up from chest",
        type: "exercise",
      },
      {
        phase: "Lateral Raises",
        reps: "3 × 12–15",
        detail: "Raise arms out to sides to shoulder height",
        type: "exercise",
      },
      {
        phase: "Dumbbell Shrugs",
        reps: "3 × 12–15",
        detail: "Lift shoulders toward ears",
        type: "exercise",
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

// The checkmark key for a single step of a workout. Kept here so the screen and
// the logging/summary logic can't drift on the key format.
export const workoutStepKey = (workoutId, stepIndex) => `w-${workoutId}-${stepIndex}`;

// Describe whichever steps of a workout are currently checked so a session can
// be logged regardless of whether the whole routine was finished. Mirrors the
// stretch summary: `complete` is true only when every step is done, and the
// name reflects that ("Upper & Lower Dumbbell" vs. "… (Partial)"). Only the
// exercise steps are surfaced as loggable exercises — warm-up/cool-down are
// counted toward progress but aren't exercises to detail.
export function summarizeWorkoutSession(workout, checked = {}) {
  const steps = workout.steps.map((step, index) => ({
    ...step,
    index,
    done: Boolean(checked[workoutStepKey(workout.id, index)]),
  }));
  const doneSteps = steps.filter((step) => step.done);
  const exercises = steps.filter((step) => step.type === "exercise");
  const doneExercises = exercises.filter((step) => step.done);
  const complete = steps.length > 0 && doneSteps.length === steps.length;

  return {
    name: complete ? workout.title : `${workout.title} (Partial)`,
    complete,
    doneSteps,
    doneCount: doneSteps.length,
    totalCount: steps.length,
    doneExercises,
    totalExercises: exercises.length,
  };
}
