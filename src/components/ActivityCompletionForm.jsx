import { useState } from "react";
import { ActivityDetailFields, inputStyle } from "./ActivityDetailFields.jsx";
import { T, font } from "../theme.js";

export function ActivityCompletionForm({ activity, onSave, onSkip }) {
  const [note, setNote] = useState(activity.note || "");
  const [details, setDetails] = useState(activity.details || {});

  return (
    <section
      aria-label="Add completion details"
      style={{
        width: "100%",
        background: T.surface,
        border: `1px solid ${activity.color}55`,
        borderRadius: 14,
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: 2, color: activity.color, fontWeight: 700 }}>
        OPTIONAL DETAILS
      </p>
      <p style={{ color: T.muted, fontSize: 12, margin: "5px 0 14px" }}>
        Add what matters, or skip and keep the basic log.
      </p>
      <ActivityDetailFields type={activity.type} details={details} onChange={setDetails} />
      <label style={{ display: "grid", gap: 5, color: T.muted, fontSize: 11, marginTop: 10 }}>
        General note
        <textarea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="How did the session feel?"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => onSave({ note: note.trim(), details })}
          style={{
            flex: 1,
            background: activity.color,
            border: "none",
            borderRadius: 9,
            padding: 10,
            color: "#000",
            fontFamily: font,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Save details
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 9,
            padding: "10px 16px",
            color: T.muted,
            fontFamily: font,
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>
    </section>
  );
}
