import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

// Owns the activity log: persistence, adding sessions, and clearing.
// Every completed session is kept — including multiple sessions of the same
// activity on the same day — so the log reflects what the user actually did.
export function useWorkoutLog() {
  const [log, setLog, saveError] = useLocalStorage(STORAGE_KEYS.log, []);

  const addLog = (entry) => setLog((prev) => [{ ts: Date.now(), ...entry }, ...prev]);

  const clearLog = () => setLog([]);

  // Remove only the entries logged today, keeping the rest of the history.
  const clearToday = () => {
    const today = new Date().toDateString();
    setLog((prev) => prev.filter((e) => new Date(e.ts).toDateString() !== today));
  };

  // Attach (or update) a free-text note on a session, identified by its
  // timestamp. An empty note is dropped so it doesn't render.
  const setNote = (ts, note) => {
    const trimmed = note.trim();
    setLog((prev) =>
      prev.map((e) => {
        if (e.ts !== ts) return e;
        const next = { ...e };
        if (trimmed) next.note = trimmed;
        else delete next.note;
        return next;
      })
    );
  };

  return { log, addLog, clearLog, clearToday, setNote, saveError };
}
