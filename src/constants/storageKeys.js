// Centralized localStorage keys so they stay consistent across hooks/screens
// and don't drift if a key name ever changes.
export const STORAGE_KEYS = {
  checked: "wellness_checked",
  log: "wellness_log",
  customWorkouts: "wellness_custom_workouts",
  syncCode: "wellness_sync_code",
  // Tracks which local day the stretch checkmarks belong to and which stretches
  // have already been logged that day, so checks persist until midnight without
  // re-logging the same session.
  stretchSession: "wellness_stretch_session",
  // Stretches and simple exercises the user chose to focus on today. The
  // original key name is kept so an existing single-stretch focus can migrate.
  dailyStretchFocus: "wellness_daily_stretch_focus",
  // Same idea for workout sets: which local day the workout checkmarks belong to
  // and which workout steps have already been logged that day, so a partial
  // routine can be logged without re-logging the same steps.
  workoutSession: "wellness_workout_session",
};
