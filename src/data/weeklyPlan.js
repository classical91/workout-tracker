// The set weekly schedule. Every activity in the app gets a fixed home across
// the week: three dumbbell days, two bodyweight days, one recovery day and one
// full rest day. Items with a `screen` link straight to that screen.
export const weeklyPlan = [
  {
    day: "Monday",
    short: "MON",
    theme: "Strength",
    emoji: "💪",
    color: "#FF6B35",
    focus: "Upper & Lower Dumbbell",
    items: [
      {
        emoji: "💪",
        name: "Workout 1 — Upper & Lower Dumbbell",
        detail: "Curls, dips, lunges, shoulder press, rows · 30 min",
        screen: "workout-sets",
      },
      {
        emoji: "🧘",
        name: "Stretch",
        detail: "Full-body cool-down · 10 min",
        screen: "stretch",
      },
    ],
  },
  {
    day: "Tuesday",
    short: "TUE",
    theme: "Move Easy",
    emoji: "🏃",
    color: "#378ADD",
    focus: "Bodyweight & Breath",
    items: [
      {
        emoji: "🏃",
        name: "Simple Workouts",
        detail: "Bodyweight circuit, no gear · 15 min",
        screen: "simple",
      },
      {
        emoji: "🚶",
        name: "Walk or Bike",
        detail: "Easy pace, outside if you can · 20 min",
        screen: null,
      },
      {
        emoji: "😮‍💨",
        name: "Breathing",
        detail: "Slow down before bed · 5 min",
        screen: "breathing",
      },
    ],
  },
  {
    day: "Wednesday",
    short: "WED",
    theme: "Strength",
    emoji: "🔥",
    color: "#FFD93D",
    focus: "Core & Lower Body Burn",
    items: [
      {
        emoji: "🔥",
        name: "Workout 2 — Core & Lower Body Burn",
        detail: "Calf raises, step-ups, sit-ups, twists · 30 min",
        screen: "workout-sets",
      },
      {
        emoji: "🧴",
        name: "Foam Roller",
        detail: "Roll out the legs and back · 10 min",
        screen: "foam-roller",
      },
    ],
  },
  {
    day: "Thursday",
    short: "THU",
    theme: "Recovery",
    emoji: "🌿",
    color: "#2ECC71",
    focus: "Active Recovery",
    items: [
      {
        emoji: "🧘",
        name: "Stretch",
        detail: "Full-body flexibility · 10 min",
        screen: "stretch",
      },
      {
        emoji: "🎯",
        name: "Trigger Points",
        detail: "Release the tight spots · 10–15 min",
        screen: "trigger-points",
      },
      {
        emoji: "🖐️",
        name: "Reflexology",
        detail: "Hand & foot pressure maps · 5–10 min",
        screen: "reflexology",
      },
    ],
  },
  {
    day: "Friday",
    short: "FRI",
    theme: "Strength",
    emoji: "🧘",
    color: "#C77DFF",
    focus: "Total Body Tone-Up",
    items: [
      {
        emoji: "🧘",
        name: "Workout 3 — Total Body Tone-Up",
        detail: "Squats, chest press, raises, shrugs · 30 min",
        screen: "workout-sets",
      },
      {
        emoji: "🧘",
        name: "Stretch",
        detail: "Full-body cool-down · 10 min",
        screen: "stretch",
      },
    ],
  },
  {
    day: "Saturday",
    short: "SAT",
    theme: "Move Easy",
    emoji: "▶️",
    color: "#E74C3C",
    focus: "Cardio & Video",
    items: [
      {
        emoji: "🏃",
        name: "Simple Workouts",
        detail: "Bodyweight circuit, no gear · 15 min",
        screen: "simple",
      },
      {
        emoji: "🚴",
        name: "Bike, Swim or Run",
        detail: "Pick one, log it from the home screen · 20–30 min",
        screen: null,
      },
      {
        emoji: "🧴",
        name: "Foam Roller",
        detail: "Recovery after cardio · 10 min",
        screen: "foam-roller",
      },
    ],
  },
  {
    day: "Sunday",
    short: "SUN",
    theme: "Rest",
    emoji: "🌙",
    color: "#4ECDC4",
    focus: "Full Rest & Calm",
    items: [
      {
        emoji: "🌙",
        name: "Calm Down",
        detail: "Breathing, ohming or a cold shower · 5–10 min",
        screen: "calm",
      },
      {
        emoji: "🛌",
        name: "Body Scan",
        detail: "Wind down for the week ahead · 10 min",
        screen: "body-scan",
      },
    ],
  },
];
