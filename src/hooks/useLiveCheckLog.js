import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { useDailyReset } from "./useDailyReset.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { DAILY_CHECK_PREFIXES } from "../data/liveLogGroups.js";
import { localDay } from "../utils/localDay.js";

const EMPTY_STATE = { day: "", entries: {}, baseline: {} };

const isDailyCheckKey = (key) => DAILY_CHECK_PREFIXES.some((prefix) => key.startsWith(prefix));

/**
 * Logs checkmarks the moment they are made.
 *
 * Each group (see buildLiveLogGroups) owns at most one log entry per local day.
 * Whenever the checked keys of a group change, that entry is created, rewritten
 * to match, or — once nothing in the group is checked any more — deleted. So
 * the log always mirrors today's checkmarks, on whichever screen they were made.
 *
 * Details the user adds to an entry (note, rating, …) are kept when the entry
 * is rewritten. An entry deleted from the log stays deleted until the group's
 * checkmarks change again.
 *
 * At local midnight the tracked checkmarks are cleared and a new day starts
 * with no entries, so yesterday's log is never touched.
 *
 * Returns `getLiveActivity(groupId)`: today's log entry for a group, or null.
 */
export function useLiveCheckLog({
  groups,
  checked,
  setChecked,
  log,
  addActivity,
  updateActivity,
  deleteActivity,
}) {
  const [state, setState] = useLocalStorage(STORAGE_KEYS.liveCheckLog, EMPTY_STATE);
  const checkedRef = useRef(checked);
  checkedRef.current = checked;

  useDailyReset(state.day, (today, previousDay) => {
    if (!previousDay) {
      // First run: whatever is already checked was logged by the old
      // per-screen logging, so leave it out rather than logging it twice.
      const baseline = {};
      for (const [key, value] of Object.entries(checkedRef.current || {})) {
        if (value && isDailyCheckKey(key)) baseline[key] = true;
      }
      setState({ day: today, entries: {}, baseline });
      return;
    }
    setChecked((previous) => {
      const next = { ...previous };
      for (const key of Object.keys(next)) if (isDailyCheckKey(key)) delete next[key];
      return next;
    });
    setState({ day: today, entries: {}, baseline: {} });
  });

  useEffect(() => {
    // The day rolled over and the reset hasn't been applied yet: these
    // checkmarks are yesterday's and are about to be cleared.
    if (state.day !== localDay()) return;
    const baseline = state.baseline || {};
    const liveIds = new Set(log.map((entry) => entry.id));
    let entries = state.entries || {};
    let changed = false;
    const setEntry = (groupId, entry) => {
      entries = { ...entries };
      if (entry) entries[groupId] = entry;
      else delete entries[groupId];
      changed = true;
    };

    for (const group of groups) {
      const keys = group.keys.filter((key) => checked[key] && !baseline[key]);
      const signature = keys.join("|");
      const entry = entries[group.id];
      if (entry ? entry.signature === signature : keys.length === 0) continue;

      if (keys.length === 0) {
        if (entry && liveIds.has(entry.id)) deleteActivity(entry.id);
        setEntry(group.id, null);
        continue;
      }

      const activity = group.build(Object.fromEntries(keys.map((key) => [key, true])));
      if (entry && liveIds.has(entry.id)) {
        updateActivity(entry.id, (previous) => ({
          ...activity,
          note: previous.note,
          details: { ...previous.details, ...activity.details },
        }));
        setEntry(group.id, { id: entry.id, signature });
      } else {
        const created = addActivity(activity);
        setEntry(group.id, { id: created.id, signature });
      }
    }

    if (changed) setState((previous) => ({ ...previous, entries }));
  }, [groups, checked, state, log, addActivity, updateActivity, deleteActivity, setState]);

  return useCallback(
    (groupId) => {
      const id = state.day === localDay() ? state.entries?.[groupId]?.id : null;
      return (id && log.find((entry) => entry.id === id)) || null;
    },
    [state, log]
  );
}
