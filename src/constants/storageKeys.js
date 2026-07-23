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
};
