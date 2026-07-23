import { useEffect, useState } from "react";
import { T, font } from "../theme.js";
import { isValidSyncCode } from "../hooks/useCloudSync.js";

const STATUS_LABEL = {
  idle: "Not syncing",
  syncing: "Syncing…",
  synced: "Synced",
  error: "Can't reach sync server",
};

const STATUS_COLOR = {
  idle: T.muted,
  syncing: T.yellow,
  synced: T.green,
  error: T.red,
};

// Lets the user connect this device to a shared sync code so the same activity
// log appears on their phone and desktop. No account — the code is the key.
export function SyncPanel({ sync }) {
  const { syncCode, setSyncCode, isSyncing, status, codeSaveError } = sync;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(syncCode || "");

  useEffect(() => setDraft(syncCode || ""), [syncCode]);

  const draftValid = isValidSyncCode(draft);
  const dotColor = STATUS_COLOR[status] || T.muted;

  const connect = () => {
    if (!draftValid) return;
    setSyncCode(draft);
    setOpen(false);
  };

  const disconnect = () => {
    setSyncCode("");
    setDraft("");
  };

  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        background: T.surface,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 16,
        fontFamily: font,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
            flex: "0 0 auto",
            boxShadow: isSyncing ? `0 0 6px ${dotColor}` : "none",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
            Sync across devices
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
            {isSyncing ? (
              <>
                {STATUS_LABEL[status]} · code <strong style={{ color: T.text }}>{syncCode}</strong>
              </>
            ) : (
              "Use one code on your phone and desktop to share this log."
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "6px 10px",
            color: T.muted,
            cursor: "pointer",
            fontFamily: font,
            fontSize: 11,
            flex: "0 0 auto",
          }}
        >
          {open ? "Close" : isSyncing ? "Manage" : "Set up"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
          <label
            htmlFor="sync-code"
            style={{ display: "block", fontSize: 11, color: T.muted, marginBottom: 6 }}
          >
            Sync code (4–64 letters, numbers or hyphens)
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              id="sync-code"
              value={draft}
              onChange={(event) => setDraft(event.target.value.toLowerCase())}
              onKeyDown={(event) => event.key === "Enter" && connect()}
              placeholder="e.g. jason-blue-otter-42"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              style={{
                flex: 1,
                minWidth: 180,
                background: T.bg,
                border: `1px solid ${draft && !draftValid ? T.red : T.border}`,
                borderRadius: 8,
                padding: "9px 11px",
                color: T.text,
                fontFamily: font,
                fontSize: 13,
              }}
            />
            <button
              type="button"
              onClick={connect}
              disabled={!draftValid}
              style={{
                background: draftValid ? T.green : T.surface2,
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                color: draftValid ? "#0A0A0C" : T.dim,
                cursor: draftValid ? "pointer" : "not-allowed",
                fontFamily: font,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {isSyncing ? "Switch" : "Connect"}
            </button>
          </div>

          {draft && !draftValid && (
            <p style={{ fontSize: 11, color: T.red, marginTop: 6 }}>
              Codes are 4–64 characters: lowercase letters, numbers or hyphens.
            </p>
          )}

          <p style={{ fontSize: 11, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
            Enter the <strong>same code</strong> on every device. Anyone who knows the code can see
            this log, so choose something only you would guess. Your existing entries merge in — nothing
            is overwritten.
          </p>

          {codeSaveError && (
            <p style={{ fontSize: 11, color: T.red, marginTop: 6 }}>
              Could not save the code on this device.
            </p>
          )}

          {isSyncing && (
            <button
              type="button"
              onClick={disconnect}
              style={{
                marginTop: 10,
                background: "none",
                border: `1px solid ${T.red}55`,
                borderRadius: 8,
                padding: "8px 14px",
                color: T.red,
                cursor: "pointer",
                fontFamily: font,
                fontSize: 12,
              }}
            >
              Stop syncing on this device
            </button>
          )}
        </div>
      )}
    </div>
  );
}
