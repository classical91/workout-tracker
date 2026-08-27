import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { SYNC_DOC_NAMES } from "../utils/mergeSyncDocs.js";

// How long to wait after the last change before pushing, so a burst of edits
// (e.g. logging several sets) results in one request instead of many.
const PUSH_DEBOUNCE_MS = 800;
// How often to poll the server for changes made on another device.
const POLL_INTERVAL_MS = 30000;

// Same rule the server enforces, so we can validate before making a request.
export function isValidSyncCode(code) {
  return /^[a-z0-9][a-z0-9-]{3,63}$/.test(
    String(code || "")
      .trim()
      .toLowerCase()
  );
}

async function requestSync(code, method, body) {
  const response = await fetch(`/api/sync/${encodeURIComponent(code)}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Sync failed (${response.status})`);
  const data = await response.json();
  return {
    log: Array.isArray(data?.log) ? data.log : [],
    docs: data?.docs && typeof data.docs === "object" ? data.docs : {},
  };
}

// Keeps a device's data in sync with a shared code on the server.
// `storedLog` is the raw stored array and `applyRemote(remoteLog)` merges a
// remote log into local storage (see useActivityLog). `docs` is a map of extra
// synced documents — the sets/reps plans and custom routines — each a handle
// from useSyncedDoc with `read()` and `applyRemote()`. Nothing happens until
// the user sets a valid code, so offline / local-only use is unaffected.
export function useCloudSync(storedLog, applyRemote, docs = {}) {
  const [syncCode, setStoredCode, codeSaveError] = useLocalStorage(STORAGE_KEYS.syncCode, "");
  const [status, setStatus] = useState("idle"); // idle | syncing | synced | error
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const active = isValidSyncCode(syncCode);
  const code = active ? syncCode.trim().toLowerCase() : "";

  // Latest values captured in refs so effects can read them without re-running.
  const logRef = useRef(storedLog);
  logRef.current = storedLog;
  const applyRef = useRef(applyRemote);
  applyRef.current = applyRemote;
  const docsRef = useRef(docs);
  docsRef.current = docs;

  // Serialized snapshot of the extra documents, so a change to a plan or a
  // custom routine schedules a push just like a change to the log does.
  const docsSignature = SYNC_DOC_NAMES.map((name) => {
    const handle = docs?.[name];
    return handle ? `${name}:${handle.read().updatedAt}` : `${name}:-`;
  }).join("|");

  const collectDocs = useCallback(() => {
    const payload = {};
    for (const name of SYNC_DOC_NAMES) {
      const handle = docsRef.current?.[name];
      if (handle) payload[name] = handle.read();
    }
    return payload;
  }, []);

  const applyDocs = useCallback((remoteDocs) => {
    for (const name of SYNC_DOC_NAMES) {
      const handle = docsRef.current?.[name];
      if (handle && remoteDocs?.[name]) handle.applyRemote(remoteDocs[name]);
    }
  }, []);

  const pull = useCallback(async () => {
    if (!code) return;
    setStatus("syncing");
    try {
      const remote = await requestSync(code, "GET");
      applyRef.current(remote.log);
      applyDocs(remote.docs);
      setStatus("synced");
      setLastSyncedAt(Date.now());
    } catch {
      setStatus("error");
    }
  }, [code, applyDocs]);

  const push = useCallback(async () => {
    if (!code) return;
    setStatus("syncing");
    try {
      const merged = await requestSync(code, "PUT", {
        log: logRef.current,
        docs: collectDocs(),
      });
      applyRef.current(merged.log);
      applyDocs(merged.docs);
      setStatus("synced");
      setLastSyncedAt(Date.now());
    } catch {
      setStatus("error");
    }
  }, [code, collectDocs, applyDocs]);

  // Pull once when a valid code becomes active, then poll for other devices.
  useEffect(() => {
    if (!code) {
      setStatus("idle");
      return;
    }
    pull();
    const id = setInterval(pull, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [code, pull]);

  // Debounced push whenever the local log or one of the synced documents
  // changes (while a code is active).
  useEffect(() => {
    if (!code) return;
    const id = setTimeout(push, PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [code, storedLog, docsSignature, push]);

  const setSyncCode = useCallback(
    (next) =>
      setStoredCode(
        String(next || "")
          .trim()
          .toLowerCase()
      ),
    [setStoredCode]
  );

  return useMemo(
    () => ({
      syncCode,
      setSyncCode,
      isSyncing: active,
      status: active ? status : "idle",
      lastSyncedAt,
      codeSaveError,
      syncNow: push,
    }),
    [syncCode, setSyncCode, active, status, lastSyncedAt, codeSaveError, push]
  );
}
