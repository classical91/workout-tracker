export const StretchIllus = {};

export const STRETCH_CHECK_PREFIX = "str-";

export const stretchCheckKey = (item) => `${STRETCH_CHECK_PREFIX}${item.key}`;

export const stretchSections = [
  {
    label: "Upper Body",
    color: "#378ADD",
    items: [
      {
        name: "Neck",
        muscles: "front, sides, back",
        hold: "30 sec/side",
        detail:
          "Slowly tilt ear toward shoulder. Use hand to gently increase stretch. Roll chin to chest for front stretch.",
        key: "neck",
      },
      {
        name: "Shoulder",
        muscles: "deltoids, rotator cuff",
        hold: "20 sec/side",
        detail:
          "Pull one arm across chest. Use other hand to press arm at elbow. Rotate arm inward for rotator cuff.",
        key: "shldr",
      },
      {
        name: "Chest",
        muscles: "pectorals",
        hold: "30 sec",
        detail:
          "Clasp hands behind back. Lift arms, squeeze shoulder blades together, open chest upward.",
        key: "chest",
      },
      {
        name: "Arms",
        muscles: "biceps, triceps",
        hold: "20 sec/side",
        detail:
          "Tricep: bend arm overhead, other hand pushes elbow. Bicep: arm behind, palm up against wall, rotate body away.",
        key: "arms",
      },
      {
        name: "Upper Back",
        muscles: "traps, rhomboids",
        hold: "30 sec",
        detail:
          "Hug arms forward, interlace fingers, round upper back like a cat. Feel stretch between shoulder blades.",
        key: "upbk",
      },
    ],
  },
  {
    label: "Core",
    color: "#C77DFF",
    items: [
      {
        name: "Abdominals",
        muscles: "front of torso",
        hold: "20–30 sec",
        detail:
          "Lie face down. Place hands under shoulders. Gently push up, keep hips on floor. (Cobra pose)",
        key: "abs",
      },
      {
        name: "Obliques",
        muscles: "sides of your torso",
        hold: "20 sec/side",
        detail:
          "Stand tall. Raise one arm overhead, lean slowly to opposite side. Feel stretch along your side.",
        key: "obl",
      },
      {
        name: "Lower Back",
        muscles: "erector spinae, quadratus lumborum",
        hold: "45 sec",
        detail:
          "Child's pose: kneel, sit back on heels, extend arms forward on floor. Breathe deeply into your lower back.",
        key: "lbk",
      },
    ],
  },
  {
    label: "Lower Body",
    color: "#2ECC71",
    items: [
      {
        name: "Hips",
        muscles: "hip flexors, glutes",
        hold: "45 sec/side",
        detail:
          "Pigeon pose: front leg bent at 90°, back leg extended. Stay upright or fold forward for deeper stretch.",
        key: "hips",
      },
      {
        name: "Groin",
        muscles: "adductors",
        hold: "30 sec",
        detail:
          "Butterfly: sit, bring soles of feet together, knees fall outward. Gently press knees toward floor.",
        key: "groin",
      },
      {
        name: "Hamstrings",
        muscles: "back of the thighs",
        hold: "30 sec/side",
        detail:
          "Stand, hinge at hips keeping back flat, reach toward toes. Or seated with one leg extended, reach for foot.",
        key: "hams",
      },
      {
        name: "Quadriceps",
        muscles: "front of the thighs",
        hold: "30 sec/side",
        detail:
          "Stand, pull one foot to glute. Keep knees together, stand tall. Hold a wall for balance if needed.",
        key: "quads",
      },
      {
        name: "Calves",
        muscles: "gastrocnemius and soleus",
        hold: "30 sec/side",
        detail:
          "Hands on wall, one leg back heel flat. Straight leg = gastrocnemius. Slightly bent knee = soleus.",
        key: "calves",
      },
      {
        name: "Ankles",
        muscles: "ankle mobility and flexion",
        hold: "10 circles/direction",
        detail:
          "Seated or standing, lift one foot. Draw large slow circles with toes. Both directions.",
        key: "ankles",
      },
      {
        name: "Feet",
        muscles: "arches, toes, peroneus tertius",
        hold: "20 sec/side",
        detail:
          "Seated: extend leg, use hand to pull toes back toward shin. Also roll foot on ball for arch massage.",
        key: "feet",
      },
    ],
  },
];

const allStretchItems = stretchSections.flatMap((section) => section.items);

const pluralAreas = (count) => `${count} area${count === 1 ? "" : "s"}`;

// A short partial session lists the body parts by name ("Neck, Shoulder");
// a long one falls back to a count so the title stays readable.
const NAME_LIST_LIMIT = 3;

// Describe whatever stretches are currently checked so a session can be logged
// regardless of whether the full routine was finished. Each done item carries
// its region label and color so the log can group and color-code the parts.
// The name reflects what was done: "Full Body Stretch", "Upper Body Stretch",
// or "Partial Stretch (Neck, Shoulder)".
export function summarizeStretchSession(checked = {}) {
  const sections = stretchSections.map((section) => {
    const items = section.items
      .filter((item) => Boolean(checked[stretchCheckKey(item)]))
      .map((item) => ({ ...item, region: section.label, color: section.color }));
    return {
      label: section.label,
      total: section.items.length,
      done: items.length,
      items,
      complete: section.items.length > 0 && items.length === section.items.length,
    };
  });

  const doneItems = sections.flatMap((section) => section.items);
  const completedSections = sections.filter((section) => section.complete);
  const fullBody = doneItems.length === allStretchItems.length && allStretchItems.length > 0;

  let name;
  if (fullBody) {
    name = "Full Body Stretch";
  } else if (completedSections.length > 0) {
    const regions = completedSections.map((section) => section.label).join(" + ");
    const extra = doneItems.length - completedSections.reduce((sum, s) => sum + s.done, 0);
    name = `${regions} Stretch${extra > 0 ? ` + ${pluralAreas(extra)}` : ""}`;
  } else {
    const names = doneItems.map((item) => item.name);
    const detail = names.length <= NAME_LIST_LIMIT ? names.join(", ") : pluralAreas(names.length);
    name = `Partial Stretch (${detail})`;
  }

  return {
    name,
    doneItems,
    completedSections: completedSections.map((section) => section.label),
    fullBody,
    doneCount: doneItems.length,
    totalCount: allStretchItems.length,
  };
}
