import { T } from "../theme.js";

export const breathModes = [
  {
    name: "Box",
    steps: ["Inhale", "Hold", "Exhale", "Hold"],
    durations: [4, 4, 4, 4],
    color: T.teal,
    desc: "Stress relief & focus",
  },
  {
    name: "4-7-8",
    steps: ["Inhale", "Hold", "Exhale"],
    durations: [4, 7, 8],
    color: T.purple,
    desc: "Sleep & anxiety relief",
  },
  {
    name: "Belly",
    steps: ["Inhale", "Hold", "Exhale"],
    durations: [5, 2, 6],
    color: T.green,
    desc: "Diaphragmatic breathing",
  },
];
