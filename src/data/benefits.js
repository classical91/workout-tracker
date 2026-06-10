// Educational content explaining WHY each part of the practice helps your body.
// Used by BenefitsScreen.

export const workoutSetBenefits = [
  {
    id: "builtin-1",
    title: "Upper & Lower Dumbbell",
    tag: "Workout 1",
    emoji: "💪",
    color: "#FF6B35",
    summary:
      "A balanced push-pull session that hits arms, shoulders, back and legs in one go.",
    points: [
      "Builds upper-body strength through bicep curls, tricep dips and shoulder presses.",
      "Bent-over rows strengthen the back and improve posture by balancing all the pushing work.",
      "Lunges add lower-body strength and single-leg balance so you train top and bottom evenly.",
      "Working large muscle groups together burns more energy and is time-efficient.",
    ],
  },
  {
    id: "builtin-2",
    title: "Core & Lower Body Burn",
    tag: "Workout 2",
    emoji: "🔥",
    color: "#FFD93D",
    summary:
      "Targets the midsection and legs to build a strong, stable foundation.",
    points: [
      "Sit-ups and Russian twists strengthen the abs and obliques for a stable, protected spine.",
      "Calf raises and step-ups build lower-leg and glute strength that powers everyday movement.",
      "Reverse flys hit the rear shoulders and upper back to counteract slouching.",
      "A strong core improves balance, reduces lower-back pain and supports every other lift.",
    ],
  },
  {
    id: "builtin-3",
    title: "Total Body Tone-Up",
    tag: "Workout 3",
    emoji: "🧘",
    color: "#C77DFF",
    summary:
      "A well-rounded full-body routine to tone and condition from head to toe.",
    points: [
      "Dumbbell squats train the biggest muscles in the body — quads, hamstrings and glutes.",
      "Chest presses and lateral raises develop a strong, defined upper body.",
      "Shrugs strengthen the traps and help relieve neck and shoulder tension.",
      "Hitting every major muscle group keeps strength balanced and supports a faster metabolism.",
    ],
  },
];

export const sharedWorkoutBenefits = [
  "Every set starts with a warm-up to raise your heart rate and prime muscles, lowering injury risk.",
  "Each finishes with a cool-down stretch to ease soreness and aid recovery.",
  "Regular resistance training builds muscle, strengthens bones and improves long-term metabolic health.",
];

export const simpleBenefits = {
  summary:
    "Bodyweight moves you can do anywhere — no equipment, low impact, easy to fit into a busy day.",
  points: [
    "No gear or gym needed, so it's easy to stay consistent at home, at a desk or while travelling.",
    "Mobility moves like head curls, chin tucks, ankle curls and wrist stretches keep joints loose and reduce stiffness.",
    "Strength moves like push-ups, squats and planks build functional strength for daily life.",
    "Posture work such as shoulder squeezes and lower-back strengthening counteracts long hours of sitting.",
    "Low-impact and scalable — adjust reps or use a wall/knees so any fitness level can take part.",
  ],
};

export const stretchBenefits = {
  summary:
    "Stretching by body region improves flexibility, eases tension and helps prevent injury.",
  general: [
    "Improves range of motion so you move more freely and comfortably.",
    "Relieves tightness built up from sitting, training or daily stress.",
    "Boosts circulation to muscles, which supports recovery.",
    "Done regularly, it lowers injury risk and can ease everyday aches.",
  ],
  sections: [
    {
      label: "Upper Body",
      color: "#378ADD",
      detail:
        "Neck, shoulder, chest, arm and upper-back stretches release the tension that builds from screens and desks, open up the chest for better posture, and keep the shoulders mobile.",
    },
    {
      label: "Core",
      color: "#C77DFF",
      detail:
        "Abdominal, oblique and lower-back stretches lengthen the trunk, relieve lower-back tightness, and keep the spine moving comfortably through twists and bends.",
    },
    {
      label: "Lower Body",
      color: "#2ECC71",
      detail:
        "Hip, groin, hamstring, quad, calf, ankle and foot stretches loosen the legs, improve walking and squatting mechanics, and protect the knees and lower back.",
    },
  ],
};
