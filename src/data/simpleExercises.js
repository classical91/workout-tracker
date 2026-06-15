const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const rawSimpleEx = [
  {
    name: "Head Curls (Side to Side)",
    reps: "2 x 10/side",
    detail:
      "Gently tilt or turn side to side to work the neck muscles, improve mobility, and reduce stiffness.",
  },
  {
    name: "Ankle Curls (Up and Down)",
    reps: "2 x 15/side",
    detail:
      "Point and flex each foot to move the ankle joints and calves, helping lower-leg mobility.",
  },
  {
    name: "Chin Tucks (Up and Down)",
    reps: "2 x 10",
    detail:
      "Draw the chin back, then release with control to strengthen the neck and upper spine for better posture.",
  },
  {
    name: "Push-Ups",
    reps: "3 x 8-12",
    detail:
      "Use the floor or knees as needed to train the chest, shoulders, triceps, and core.",
  },
  {
    name: "Shoulder Squeeze",
    reps: "3 x 12",
    detail:
      "Pull shoulder blades back and down, hold briefly, then release to strengthen the upper back and improve posture.",
  },
  {
    name: "Squat Pulses",
    reps: "3 x 15",
    detail:
      "Hold a shallow squat and pulse with control to build the thighs, glutes, and calves.",
  },
  {
    name: "Split Squats",
    reps: "3 x 8/side",
    detail:
      "Step one foot back and lower straight down to train quads, hamstrings, glutes, and balance.",
  },
  {
    name: "Squats",
    reps: "3 x 12",
    detail:
      "Sit the hips back and stand tall to strengthen the thighs, hips, glutes, and lower back.",
  },
  {
    name: "Lower Back Strengthening",
    reps: "3 x 10",
    detail:
      "Use slow back extensions, bird dogs, or supermans to build support through the lower and upper back.",
  },
  {
    name: "Calf Raise",
    reps: "3 x 15",
    detail:
      "Rise onto the balls of your feet, pause, then lower with control to strengthen the calves.",
  },
  {
    name: "Torso Twist",
    reps: "2 x 12/side",
    detail:
      "Rotate from the trunk with control to engage the core and obliques while improving rotational flexibility.",
  },
  {
    name: "Side Leg Raise",
    reps: "3 x 12/side",
    detail:
      "Lift the leg out to the side while standing or lying down to strengthen hips, glutes, and outer thighs.",
  },
  {
    name: "Seated Leg Raise",
    reps: "3 x 12/side",
    detail:
      "Sit tall, extend one leg, hold briefly, and lower to strengthen hip flexors and quadriceps.",
  },
  {
    name: "Sit-Ups",
    reps: "3 x 10",
    detail:
      "Curl the upper body up with control to focus on abdominal strength and core endurance.",
  },
  {
    name: "Planking",
    reps: "3 x 30 sec",
    detail:
      "Hold a straight line from shoulders to heels to train the core, shoulders, and back stability.",
  },
  {
    name: "Desk Push-Up",
    reps: "3 x 12",
    detail:
      "Place hands on a sturdy desk and lower the chest toward it to train chest, shoulders, and triceps.",
  },
  {
    name: "Wrist Stretches",
    reps: "2 x 30 sec",
    detail:
      "Gently stretch the wrists forward and backward to improve flexibility and reduce tension.",
  },
];

// Attach a stable, URL-friendly slug so each exercise has its own linkable page.
export const simpleEx = rawSimpleEx.map((e) => ({ ...e, slug: slugify(e.name) }));

export const findSimpleEx = (slug) => {
  const index = simpleEx.findIndex((e) => e.slug === slug);
  return index === -1 ? null : { exercise: simpleEx[index], index };
};
