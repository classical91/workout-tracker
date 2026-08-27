import { useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// A stored value that also travels between devices. It's kept as
// `{ value, updatedAt }` so the sync server can resolve two devices editing the
// same document the obvious way: the most recent edit wins. Anything written
// before this wrapper existed (a bare value) is migrated on first read.
function wrap(stored, fallback) {
  if (stored && typeof stored === "object" && !Array.isArray(stored) && "value" in stored) {
    return { value: stored.value ?? fallback, updatedAt: Number(stored.updatedAt) || 0 };
  }
  if (stored == null) return { value: fallback, updatedAt: 0 };
  return { value: stored, updatedAt: 0 };
}

// Returns the value, a setter (value or updater, exactly like useState), and a
// `doc` handle the sync hook uses to push and apply remote copies.
export function useSyncedDoc(key, initialValue) {
  const [stored, setStored, saveError] = useLocalStorage(key, {
    value: initialValue,
    updatedAt: 0,
  });
  const current = wrap(stored, initialValue);

  // Refs so the callbacks below stay stable — useCloudSync keeps them in
  // effect dependencies.
  const valueRef = useRef(current.value);
  valueRef.current = current.value;
  const updatedAtRef = useRef(current.updatedAt);
  updatedAtRef.current = current.updatedAt;

  const setValue = useCallback(
    (next) =>
      setStored((previous) => {
        const before = wrap(previous, initialValue);
        const value = typeof next === "function" ? next(before.value) : next;
        if (JSON.stringify(value) === JSON.stringify(before.value)) return previous;
        return { value, updatedAt: Date.now() };
      }),
    // `initialValue` is a constant default per call site; re-creating the
    // setter when its identity changes would churn every consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStored]
  );

  // Adopt a remote copy only when it is genuinely newer, so polling can't
  // undo an edit made here a moment ago.
  const applyRemote = useCallback(
    (remote) => {
      if (!remote || typeof remote !== "object") return;
      const remoteUpdatedAt = Number(remote.updatedAt) || 0;
      if (remote.value === undefined || remoteUpdatedAt <= updatedAtRef.current) return;
      setStored({ value: remote.value, updatedAt: remoteUpdatedAt });
    },
    [setStored]
  );

  const read = useCallback(
    () => ({ value: valueRef.current, updatedAt: updatedAtRef.current }),
    []
  );

  return [current.value, setValue, { read, applyRemote, saveError }];
}
