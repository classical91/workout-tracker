import { useState } from "react";
import { ActivityDetailFields, inputStyle } from "./ActivityDetailFields.jsx";
import { T, font } from "../theme.js";

export function ActivityDetailEditor({ entry, onSave, onCancel }) {
  const [duration, setDuration] = useState(entry.duration || "");
  const [note, setNote] = useState(entry.note || "");
  const [details, setDetails] = useState(entry.details || {});

  return (
    <div style={{ marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
      <label style={{ display: "grid", gap: 5, color: T.muted, fontSize: 11, marginBottom: 10 }}>
        Duration
        <input
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          placeholder="30 min"
          style={inputStyle}
        />
      </label>
      <ActivityDetailFields type={entry.type} details={details} onChange={setDetails} />
      <label style={{ display: "grid", gap: 5, color: T.muted, fontSize: 11, marginTop: 10 }}>
        Note
        <textarea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="button"
          onClick={() => onSave({ duration: duration.trim(), note: note.trim(), details })}
          style={{
            background: entry.color,
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#000",
            fontFamily: font,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "8px 16px",
            color: T.muted,
            fontFamily: font,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
