import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

// Owns the activity log: persistence, adding sessions, and clearing.
// Every completed session is kept — including multiple sessions of the same
// activity on the same day — so the log reflects what the user actually did.
export function useWorkoutLog() {
  const [log, setLog, saveError] = useLocalStorage(STORAGE_KEYS.log, []);

  const addLog = (entry) => setLog((prev) => [{ ts: Date.now(), ...entry }, ...prev]);

  const clearLog = () => setLog([]);

  return { log, addLog, clearLog, saveError };
}
