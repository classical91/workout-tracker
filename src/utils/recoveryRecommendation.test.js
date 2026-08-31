import { describe, expect, it } from "vitest";
import { RECOVERY_TOOLS, musclesFromExercises } from "../data/recovery.js";
import {
  getRecoveryRecommendation,
  isRecoveryToolSafeForRegion,
} from "./recoveryRecommendation.js";

const monday = new Date(2026, 7, 31, 12);

describe("recovery recommendation logic", () => {
  it("targets leg muscles and suggests the Monday foam-roller rotation", () => {
    const trainedMuscles = musclesFromExercises([
      { name: "Dumbbell Squats" },
      { name: "Standing Calf Raise" },
    ]);
    const result = getRecoveryRecommendation({ date: monday, trainedMuscles });

    expect(trainedMuscles).toEqual(expect.arrayContaining(["quads", "glutes", "calves"]));
    expect(result.recommendedTool).toBe(RECOVERY_TOOLS.FOAM_ROLLER);
    expect(result.stretchingType).toBe("full_body");
    expect(result.optional).toBe(true);
  });

  it("recognizes upper-body training and prefers the Tuesday massage-gun rotation", () => {
    const trainedMuscles = musclesFromExercises([
      { name: "Shoulder Press" },
      { name: "Bent-over Rows" },
    ]);
    const tuesday = new Date(2026, 8, 1, 12);
    const result = getRecoveryRecommendation({ date: tuesday, trainedMuscles });

    expect(trainedMuscles).toEqual(
      expect.arrayContaining(["shoulders", "triceps", "upper_back", "lats"])
    );
    expect(result.stretchingType).toBe("targeted");
    expect(result.recommendedTool).toBe(RECOVERY_TOOLS.MASSAGE_GUN);
  });

  it("falls back to full-body mobility when no workout muscle data exists", () => {
    const wednesday = new Date(2026, 8, 2, 12);
    const result = getRecoveryRecommendation({ date: wednesday });

    expect(result.stretchingType).toBe("full_body");
    expect(result.stretches).toHaveLength(4);
    expect(result.recommendedTool).toBe(RECOVERY_TOOLS.ACUPRESSURE);
  });

  it("uses knot and head/neck check-ins to narrow appropriate tools", () => {
    const knot = getRecoveryRecommendation({
      date: monday,
      trainedMuscles: ["traps"],
      bodyCheckIn: "muscle_knot",
      problemArea: "traps",
    });
    const headNeck = getRecoveryRecommendation({
      date: monday,
      bodyCheckIn: "head_neck_tension",
      problemArea: "neck",
    });

    expect(knot.toolOptions).toContain(RECOVERY_TOOLS.ACUPRESSURE);
    expect(headNeck.toolOptions).toEqual(
      expect.arrayContaining([RECOVERY_TOOLS.ACUPRESSURE, RECOVERY_TOOLS.COLD_THERAPY])
    );
    expect(headNeck.toolOptions).not.toContain(RECOVERY_TOOLS.MASSAGE_GUN);
  });

  it("rotates away from a tool used yesterday when another suitable tool is fresh", () => {
    const yesterday = monday.getTime() - 24 * 60 * 60 * 1000;
    const result = getRecoveryRecommendation({
      date: monday,
      trainedMuscles: ["quads", "glutes"],
      recentRecoveryHistory: [
        {
          type: "recovery",
          ts: yesterday,
          details: { recoveryToolsUsed: [RECOVERY_TOOLS.FOAM_ROLLER] },
        },
      ],
    });

    expect(result.recommendedTool).toBe(RECOVERY_TOOLS.MASSAGE_GUN);
  });

  it("filters unsafe massage-gun/body-region combinations", () => {
    expect(isRecoveryToolSafeForRegion(RECOVERY_TOOLS.MASSAGE_GUN, "neck")).toBe(false);
    expect(isRecoveryToolSafeForRegion(RECOVERY_TOOLS.MASSAGE_GUN, "lower_back")).toBe(false);
    expect(isRecoveryToolSafeForRegion(RECOVERY_TOOLS.FOAM_ROLLER, "neck")).toBe(false);
    expect(isRecoveryToolSafeForRegion(RECOVERY_TOOLS.MASSAGE_GUN, "quads")).toBe(true);
  });
});
