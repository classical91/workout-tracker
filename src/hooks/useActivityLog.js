import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { useCloudSync } from "./useCloudSync.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { mergeActivityLogs } from "../utils/mergeActivityLog.js";
import {
  createActivity,
  normalizeActivityEntry,
  normalizeActivityLog,
} from "../utils/normalizeActivityLog.js";

// A deleted entry is kept as a lightweight tombstone rather than removed, so the
// deletion syncs to other devices instead of the entry reappearing from a stale
// copy. Tombstones are filtered out of the log the UI sees.
function tombstone(entry) {
  return { id: entry.id, ts: entry.ts, deleted: true, updatedAt: Date.now() };
}

export function useActivityLog() {
  const [storedLog, setStoredLog, saveError] = useLocalStorage(STORAGE_KEYS.log, []);
  const log = useMemo(
    () => normalizeActivityLog(storedLog).filter((entry) => !entry.deleted),
    [storedLog]
  );

  // Merge a remote log (from another device) into local storage. Returns the
  // same reference when nothing changed so it doesn't trigger a needless
  // re-render or a ping-pong of sync requests.
  const applyRemote = useCallback(
    (remote) => {
      setStoredLog((previous) => {
        const prev = Array.isArray(previous) ? previous : [];
        const merged = mergeActivityLogs(prev, Array.isArray(remote) ? remote : []);
        return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged;
      });
    },
    [setStoredLog]
  );

  const sync = useCloudSync(storedLog, applyRemote);

  const addActivity = useCallback(
    (entry) => {
      const activity = createActivity(entry);
      setStoredLog((previous) => [activity, ...(Array.isArray(previous) ? previous : [])]);
      return activity;
    },
    [setStoredLog]
  );

  const updateActivity = useCallback(
    (id, updates) => {
      setStoredLog((previous) =>
        (Array.isArray(previous) ? previous : []).map((entry, index) => {
          const normalized = normalizeActivityEntry(entry, index);
          const matches = normalized.id === id || (!entry.id && entry.ts === id);
          if (!matches) return entry;
          const nextUpdates = typeof updates === "function" ? updates(normalized) : updates;
          return createActivity({
            ...normalized,
            ...nextUpdates,
            id: normalized.id,
            ts: normalized.ts,
            updatedAt: Date.now(),
            details: nextUpdates?.details ?? normalized.details,
          });
        })
      );
    },
    [setStoredLog]
  );

  const deleteActivity = useCallback(
    (id) =>
      setStoredLog((previous) =>
        (Array.isArray(previous) ? previous : []).map((entry, index) => {
          const normalized = normalizeActivityEntry(entry, index);
          const matches = normalized.id === id || (!entry.id && entry.ts === id);
          return matches ? tombstone(normalized) : entry;
        })
      ),
    [setStoredLog]
  );

  const clearLog = useCallback(
    () =>
      setStoredLog((previous) =>
        (Array.isArray(previous) ? previous : []).map((entry, index) =>
          tombstone(normalizeActivityEntry(entry, index))
        )
      ),
    [setStoredLog]
  );

  const clearToday = useCallback(() => {
    const today = new Date().toDateString();
    setStoredLog((previous) =>
      (Array.isArray(previous) ? previous : []).map((entry, index) => {
        const normalized = normalizeActivityEntry(entry, index);
        if (normalized.deleted) return entry;
        return new Date(normalized.ts).toDateString() === today ? tombstone(normalized) : entry;
      })
    );
  }, [setStoredLog]);

  const setNote = useCallback(
    (id, note) => updateActivity(id, { note: typeof note === "string" ? note.trim() : "" }),
    [updateActivity]
  );

  return {
    log,
    addActivity,
    updateActivity,
    deleteActivity,
    clearLog,
    clearToday,
    setNote,
    saveError,
    sync,
  };
}
