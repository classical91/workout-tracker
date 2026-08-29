const slugifyFocus = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Every source a focus can come from. Anything else stored — including the very
// first version of this feature, which had no `source` at all — reads back as a
// stretch, which is what it was.
const FOCUS_SOURCES = new Set(["stretch", "simple", "trigger"]);

export const stretchDailyFocus = (item) => ({
  id: `stretch:${item.key}`,
  name: item.name,
  source: "stretch",
  imageQuery: `${item.name} stretch`,
});

export const simpleExerciseDailyFocus = (exercise) => ({
  id: `simple:${exercise.slug}`,
  name: exercise.name,
  source: "simple",
  imageQuery: `${exercise.name} exercise`,
});

// One hotspot on the trigger-point body map. The id is per hotspot rather than
// per muscle so the left and right side of the same muscle can both be focuses,
// and so tapping the same dot twice can't add it twice.
export const triggerPointDailyFocus = (item, hotspot) => ({
  id: `trigger:${hotspot.id}`,
  name: item.name,
  source: "trigger",
  triggerPointKey: item.key,
  hotspotId: hotspot.id,
  side: hotspot.side,
});

const defaultImageQuery = (name, source) =>
  source === "simple" ? `${name} exercise` : `${name} stretch`;

// Read the current list while preserving the first version of this feature,
// which stored one stretch as `{ day, name }`.
export function dailyFocusesFromState(state) {
  const candidates = Array.isArray(state?.focuses)
    ? state.focuses
    : state?.name
      ? [
          {
            id: `stretch:${slugifyFocus(state.name)}`,
            name: state.name,
            source: "stretch",
            imageQuery: `${state.name} stretch`,
          },
        ]
      : [];

  const seen = new Set();
  return candidates
    .filter((focus) => focus?.name)
    .map((focus) => {
      const source = FOCUS_SOURCES.has(focus.source) ? focus.source : "stretch";
      const normalized = {
        id: focus.id || `${source}:${slugifyFocus(focus.name)}`,
        name: focus.name,
        source,
      };

      // Trigger points carry which muscle and which side the hotspot was on,
      // and have a curated guide on the map instead of an image search.
      if (source === "trigger") {
        if (focus.triggerPointKey) normalized.triggerPointKey = focus.triggerPointKey;
        if (focus.hotspotId) normalized.hotspotId = focus.hotspotId;
        if (focus.side) normalized.side = focus.side;
        return normalized;
      }

      normalized.imageQuery = focus.imageQuery || defaultImageQuery(focus.name, source);
      return normalized;
    })
    .filter((focus) => {
      if (seen.has(focus.id)) return false;
      seen.add(focus.id);
      return true;
    });
}

export function addDailyFocusToState(state, focus, today) {
  const current = state?.day === today ? dailyFocusesFromState(state) : [];
  if (current.some((item) => item.id === focus.id)) {
    return { day: today, focuses: current };
  }
  return { day: today, focuses: [...current, focus] };
}

export function removeDailyFocusFromState(state, focusId, today) {
  const current = state?.day === today ? dailyFocusesFromState(state) : [];
  return {
    day: today,
    focuses: current.filter((focus) => focus.id !== focusId),
  };
}
