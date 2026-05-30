import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored == null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  // Tracks whether the most recent save failed (storage full, disabled, or
  // private mode) so the UI can warn the user instead of silently losing data.
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [key, value]);

  return [value, setValue, saveError];
}
