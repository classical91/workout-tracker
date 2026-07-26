const slugifyFocus = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
      const source = focus.source === "simple" ? "simple" : "stretch";
      return {
        id: focus.id || `${source}:${slugifyFocus(focus.name)}`,
        name: focus.name,
        source,
        imageQuery:
          focus.imageQuery || `${focus.name} ${source === "simple" ? "exercise" : "stretch"}`,
      };
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
