import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import {
  createActivity,
  normalizeActivityEntry,
  normalizeActivityLog,
} from "../utils/normalizeActivityLog.js";

export function useActivityLog() {
  const [storedLog, setStoredLog, saveError] = useLocalStorage(STORAGE_KEYS.log, []);
  const log = useMemo(() => normalizeActivityLog(storedLog), [storedLog]);

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
        (Array.isArray(previous) ? previous : []).filter((entry, index) => {
          const normalized = normalizeActivityEntry(entry, index);
          return normalized.id !== id && !(!entry.id && entry.ts === id);
        })
      ),
    [setStoredLog]
  );

  const clearLog = useCallback(() => setStoredLog([]), [setStoredLog]);

  const clearToday = useCallback(() => {
    const today = new Date().toDateString();
    setStoredLog((previous) =>
      (Array.isArray(previous) ? previous : []).filter(
        (entry) => new Date(entry.ts).toDateString() !== today
      )
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
  };
}
