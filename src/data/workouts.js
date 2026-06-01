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
  {
    id: "builtin-4",
    title: "Dumbbell Back Workout",
    color: "#378ADD",
    emoji: "🏋️",
    tag: "Workout 4",
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

export const tsStyle = {
  warmup: { bg: "#0F1F1A", ac: "#4ECDC4" },
  exercise: { bg: "#16161A", ac: null },
  cooldown: { bg: "#0F0F1F", ac: "#4ECDC4" },
};
