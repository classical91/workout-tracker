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

  return { log, addLog, clearLog, clearToday, saveError };
}
