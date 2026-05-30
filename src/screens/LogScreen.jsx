import { useState } from "react";
import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

function LogEntry({ entry, color, onSetNote }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.note || "");
  const accent = entry.color || color;

  const save = () => {
    onSetNote(entry.ts, draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(entry.note || "");
    setEditing(false);
  };

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {entry.emoji} {entry.name}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{entry.duration}</div>
        </div>
        <div style={{ fontFamily: display, fontSize: 20, color: accent }}>✓</div>
      </div>

      {!editing && entry.note && (
        <p
          style={{
            fontSize: 12,
            color: T.text,
            background: T.surface2,
            borderRadius: 8,
            padding: "8px 10px",
            margin: "10px 0 0",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {entry.note}
        </p>
      )}

      {editing ? (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            rows={3}
            placeholder="reps, weight, how it felt…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: T.bg,
              border: `1px solid ${accent}55`,
              borderRadius: 8,
              color: T.text,
              fontFamily: font,
              fontSize: 12,
              padding: "8px 10px",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={save}
              style={{
                background: accent,
                border: "none",
                borderRadius: 8,
                padding: "7px 16px",
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: font,
              }}
            >
              Save
            </button>
            <button
              onClick={cancel}
              style={{
                background: "none",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "7px 16px",
                color: T.muted,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: font,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          style={{
            background: "none",
            border: "none",
            color: T.muted,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            padding: "8px 0 0",
            fontFamily: font,
          }}
        >
          {entry.note ? "✏️ Edit note" : "+ Add note"}
        </button>
      )}
    </div>
  );
}

export function LogScreen({ onBack, log, onClear, onClearToday, onSetNote }) {
  const color = T.yellow;
  const today = new Date().toDateString();
  const hasToday = log.some((e) => new Date(e.ts).toDateString() === today);
  const grouped = log.reduce((acc, e) => {
    const d = new Date(e.ts).toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});
  const days = Object.keys(grouped).reverse();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: font,
        color: T.text,
        paddingBottom: 60,
      }}
    >
      <ScreenHeader
        title="Exercise Log"
        subtitle="HISTORY"
        emoji="📋"
        color={color}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        {log.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p>
              No activities logged yet.
              <br />
              Complete a session to see it here.
            </p>
          </div>
        ) : (
          <>
            {days.map((day) => (
              <div key={day} style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: T.muted,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {day.toUpperCase()}
                </p>
                {grouped[day].map((e) => (
                  <LogEntry key={e.ts} entry={e} color={color} onSetNote={onSetNote} />
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {hasToday && (
                <button
                  onClick={onClearToday}
                  style={{
                    background: "none",
                    border: `1px solid ${color}55`,
                    borderRadius: 10,
                    padding: "10px 20px",
                    color,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: font,
                  }}
                >
                  Reset Today
                </button>
              )}
              <button
                onClick={onClear}
                style={{
                  background: "none",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "10px 20px",
                  color: T.muted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: font,
                }}
              >
                Clear Log
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
