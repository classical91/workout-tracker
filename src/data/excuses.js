// Excuse busters: the classic reasons to skip a session, each paired with a
// comeback and the smallest possible action that still counts. Actions with a
// `screen` link straight to that screen.
export const excuses = [
  {
    id: "no-time",
    excuse: "I don't have time today",
    emoji: "⏰",
    color: "#FF6B35",
    comeback:
      "You don't need the full 30 minutes. Five minutes of movement beats zero, and it usually turns into more once you start.",
    action: { label: "Do a 15-min simple workout", screen: "simple" },
  },
  {
    id: "too-tired",
    excuse: "I'm too tired",
    emoji: "🥱",
    color: "#378ADD",
    comeback:
      "Light movement raises energy more reliably than resting does. If you're truly wiped, gentle counts — you don't have to lift a thing.",
    action: { label: "Stretch for 10 minutes", screen: "stretch" },
  },
  {
    id: "sore",
    excuse: "I'm still sore from last time",
    emoji: "🤕",
    color: "#4ECDC4",
    comeback:
      "Soreness is a recovery signal, not a stop sign. Blood flow speeds it up — that's exactly what the recovery tools are for.",
    action: { label: "Foam roll the sore spots", screen: "foam-roller" },
  },
  {
    id: "no-motivation",
    excuse: "I'm just not feeling it",
    emoji: "😩",
    color: "#C77DFF",
    comeback:
      "Motivation follows action, not the other way around. Commit to the warm-up only — if you still want to quit after it, you can.",
    action: { label: "Start Workout 1's warm-up", screen: "workout-sets" },
  },
  {
    id: "too-stressed",
    excuse: "I'm too stressed to work out",
    emoji: "😤",
    color: "#2ECC71",
    comeback:
      "Stress is stored in the body, and movement is one of the fastest ways out of it. Even slow breathing counts as showing up.",
    action: { label: "Do 5 minutes of breathing", screen: "breathing" },
  },
  {
    id: "too-late",
    excuse: "It's too late in the day now",
    emoji: "🌙",
    color: "#4ECDC4",
    comeback:
      "A calm evening session still moves the needle, and winding down properly makes tomorrow's session more likely to happen.",
    action: { label: "Do a 10-min body scan", screen: "body-scan" },
  },
  {
    id: "no-equipment",
    excuse: "I don't have my equipment",
    emoji: "🎒",
    color: "#378ADD",
    comeback:
      "Half the app needs nothing but a floor. Bodyweight circuits, stretches and pressure-point work travel everywhere you do.",
    action: { label: "Do a no-gear workout", screen: "simple" },
  },
  {
    id: "start-monday",
    excuse: "I'll start again on Monday",
    emoji: "📅",
    color: "#FFD93D",
    comeback:
      "Monday is a date, not a requirement. The plan already tells you what today is for — jump back in exactly where the week says.",
    action: { label: "See today's plan", screen: "weekly-plan" },
  },
  {
    id: "no-results",
    excuse: "It's not working anyway",
    emoji: "📉",
    color: "#E74C3C",
    comeback:
      "Results lag effort by weeks. Your log is the proof of work — streaks compound quietly before they show in the mirror.",
    action: { label: "Look at your exercise log", screen: "log" },
  },
  {
    id: "one-day",
    excuse: "Missing one day won't matter",
    emoji: "🎲",
    color: "#FF6B35",
    comeback:
      "One day doesn't — but skipping is a skill you get better at with practice. Protect the habit, even with a tiny session.",
    action: { label: "Do the smallest thing: stretch", screen: "stretch" },
  },
];
