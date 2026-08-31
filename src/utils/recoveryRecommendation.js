import {
  RECOVERY_REASONS,
  RECOVERY_TOOL_CONFIG,
  RECOVERY_TOOLS,
  STRETCH_DURATIONS,
  WEEKLY_RECOVERY_ROTATION,
  bodyRegionById,
  stretchesForMuscles,
} from "../data/recovery.js";

const SECONDARY_TOOLS = Object.values(RECOVERY_TOOLS);

export function isRecoveryToolSafeForRegion(tool, regionId) {
  if (!tool || !regionId) return true;
  return !RECOVERY_TOOL_CONFIG[tool]?.blockedRegions?.includes(regionId);
}

function toolsUsedByEntry(entry) {
  if (entry?.type !== "recovery") return [];
  return Array.isArray(entry.details?.recoveryToolsUsed) ? entry.details.recoveryToolsUsed : [];
}

function lastUsedAt(tool, history = []) {
  return history.reduce((latest, entry) => {
    if (!toolsUsedByEntry(entry).includes(tool)) return latest;
    const timestamp = Number(entry.ts || Date.parse(entry.details?.date));
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, 0);
}

function relevantTools({ trainedMuscles, bodyCheckIn, problemArea }) {
  if (bodyCheckIn === "head_neck_tension") {
    return [RECOVERY_TOOLS.ACUPRESSURE, RECOVERY_TOOLS.COLD_THERAPY];
  }
  if (bodyCheckIn === "muscle_knot") {
    return [RECOVERY_TOOLS.ACUPRESSURE, RECOVERY_TOOLS.MASSAGE_GUN, RECOVERY_TOOLS.FOAM_ROLLER];
  }
  if (bodyCheckIn === "sore") {
    return [RECOVERY_TOOLS.FOAM_ROLLER, RECOVERY_TOOLS.MASSAGE_GUN, RECOVERY_TOOLS.COLD_THERAPY];
  }

  const matching = SECONDARY_TOOLS.filter((tool) =>
    RECOVERY_TOOL_CONFIG[tool].muscles.some((muscle) => trainedMuscles.includes(muscle))
  );
  const options = matching.length
    ? matching
    : [RECOVERY_TOOLS.FOAM_ROLLER, RECOVERY_TOOLS.MASSAGE_GUN, RECOVERY_TOOLS.ACUPRESSURE];
  return options.filter((tool) => isRecoveryToolSafeForRegion(tool, problemArea));
}

function recoveryReason(bodyCheckIn, trainedMuscles) {
  if (bodyCheckIn === "muscle_knot") return RECOVERY_REASONS.MUSCLE_KNOT;
  if (bodyCheckIn === "tight_stiff") return RECOVERY_REASONS.TIGHTNESS;
  if (bodyCheckIn === "sore") return RECOVERY_REASONS.SORENESS;
  if (bodyCheckIn === "head_neck_tension") return RECOVERY_REASONS.HEAD_NECK_TENSION;
  return trainedMuscles.length ? RECOVERY_REASONS.TRAINED_MUSCLE : RECOVERY_REASONS.DAILY_MOBILITY;
}

export function getRecoveryRecommendation({
  date = new Date(),
  trainedMuscles = [],
  bodyCheckIn = null,
  problemArea = null,
  recentRecoveryHistory = [],
} = {}) {
  const resolvedDate = date instanceof Date ? date : new Date(date);
  const rotation = WEEKLY_RECOVERY_ROTATION[resolvedDate.getDay()];
  const candidates = relevantTools({ trainedMuscles, bodyCheckIn, problemArea }).filter((tool) =>
    isRecoveryToolSafeForRegion(tool, problemArea)
  );
  const now = resolvedDate.getTime();

  const scored = candidates.map((tool, index) => {
    const lastUsed = lastUsedAt(tool, recentRecoveryHistory);
    const hoursSinceUse = lastUsed ? (now - lastUsed) / 3_600_000 : Infinity;
    let score = candidates.length - index;
    if (tool === rotation.tool) score += 4;
    if (!lastUsed) score += 6;
    else if (hoursSinceUse < 36) score -= 10;
    else score += Math.min(5, hoursSinceUse / 48);
    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score || a.tool.localeCompare(b.tool));
  const recommendedTool = scored[0]?.tool || rotation.tool || RECOVERY_TOOLS.ACUPRESSURE;
  const stretchingType =
    trainedMuscles.length && rotation.stretchingType === "targeted"
      ? "targeted"
      : rotation.stretchingType;

  return {
    primary: "stretching",
    stretchingType,
    stretchDuration: STRETCH_DURATIONS[rotation.duration],
    stretches: stretchesForMuscles(stretchingType === "targeted" ? trainedMuscles : [], 4),
    recommendedTool,
    toolOptions: [recommendedTool, ...candidates.filter((tool) => tool !== recommendedTool)],
    availableTools: SECONDARY_TOOLS.filter((tool) =>
      isRecoveryToolSafeForRegion(tool, problemArea)
    ),
    reason: recoveryReason(bodyCheckIn, trainedMuscles),
    optional: true,
    problemRegion: bodyRegionById(problemArea) || null,
  };
}
