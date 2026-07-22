import { useState } from "react";
import { labelActivityValue, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { ActivityDetailEditor } from "./ActivityDetailEditor.jsx";
import { T, font } from "../theme.js";

function DetailSummary({ entry }) {
  const details = entry.details || {};
  const exercises = details.exercises || details.plannedExercises || [];

  if (exercises.length) {
    return exercises.map((exercise, index) => {
      const sets = exercise.setCount || exercise.sets?.length;
      const weight = exercise.weight ?? exercise.sets?.find((set) => set.weight)?.weight;
      const unit = exercise.weightUnit || exercise.sets?.find((set) => set.weightUnit)?.weightUnit;
      const summary = [
        sets ? `${sets} sets` : exercise.planned,
        weight ? `${weight} ${unit || "lb"}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return (
        <div key={`${exercise.name}-${index}`} style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{exercise.name}</div>
          {summary && <div style={{ fontSize: 11, color: T.muted }}>{summary}</div>}
        </div>
      );
    });
  }

  if (details.holds?.length) {
    return details.holds.map((hold, index) => (
      <div key={`${hold.name}-${index}`} style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: hold.color || T.text }}>{hold.name}</div>
        <div style={{ fontSize: 11, color: T.muted }}>
          {hold.seconds ? `${hold.seconds}s` : hold.planned}
          {hold.region ? ` · ${hold.region}` : ""}
          {hold.rounds ? ` · ${hold.rounds} rounds` : ""}
        </div>
      </div>
    ));
  }

  const lines = [];
  if (entry.type === ACTIVITY_TYPES.SAUNA) {
    if (details.rounds !== "" && details.rounds != null) lines.push(`${details.rounds} rounds`);
    if (details.temperature !== "" && details.temperature != null)
      lines.push(`${details.temperature}°${details.temperatureUnit || "C"}`);
    if (typeof details.coldExposureAfter === "boolean")
      lines.push(`Cold exposure afterward: ${details.coldExposureAfter ? "Yes" : "No"}`);
  }
  if ([ACTIVITY_TYPES.BREATHING, ACTIVITY_TYPES.OHMING].includes(entry.type)) {
    if (details.technique) lines.push(details.technique);
    if (details.rounds !== "" && details.rounds != null) lines.push(`${details.rounds} rounds`);
    const pattern = [
      details.inhaleSeconds,
      details.holdSeconds,
      details.exhaleSeconds,
      details.secondHoldSeconds,
    ].filter((value) => value !== "" && value != null);
    if (pattern.length) lines.push(`${pattern.join("-")} pattern`);
  }
  if (details.bodyAreas?.length) lines.push(details.bodyAreas.join(", "));
  if (details.pressure) lines.push(`Pressure: ${details.pressure}`);
  if (details.tenderPoints !== "" && details.tenderPoints != null)
    lines.push(`Tender points: ${details.tenderPoints}`);
  if (details.reliefAfter) lines.push(`Relief after: ${details.reliefAfter}`);
  if (details.intensity) lines.push(`Intensity: ${details.intensity}`);
  if (details.feelingBefore || details.moodBefore)
    lines.push(`Before: ${details.feelingBefore || details.moodBefore}`);
  if (details.feelingAfter || details.moodAfter)
    lines.push(`After: ${details.feelingAfter || details.moodAfter}`);
  if (details.focusQuality) lines.push(`Focus: ${details.focusQuality}`);
  if (details.interruptions !== "" && details.interruptions != null)
    lines.push(`Interruptions: ${details.interruptions}`);

  return lines.map((line) => (
    <div key={line} style={{ color: T.muted, fontSize: 11, marginTop: 5 }}>
      {line}
    </div>
  ));
}

export function ActivityLogCard({ entry, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const dateTime = new Date(entry.ts).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <article
      style={{
        background: T.surface,
        border: `1px solid ${expanded ? `${entry.color}66` : T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 9,
        transition: "border-color 160ms ease, transform 160ms ease",
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          gap: 12,
          background: "none",
          border: 0,
          color: T.text,
          font: "inherit",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 27, lineHeight: 1 }}>{entry.emoji}</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{entry.name}</span>
          <span style={{ display: "block", color: entry.color, fontSize: 10, marginTop: 4 }}>
            {labelActivityValue(entry.category)}
            {entry.duration ? ` · ${entry.duration}` : ""}
          </span>
          <span style={{ display: "block", color: T.muted, fontSize: 10, marginTop: 3 }}>
            {dateTime} · {labelActivityValue(entry.type)}
          </span>
        </span>
        <span
          aria-hidden="true"
          style={{ color: T.muted, transform: expanded ? "rotate(180deg)" : "none" }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div style={{ animation: "fadeIn 160ms ease" }}>
          <DetailSummary entry={entry} />
          {entry.note && (
            <p
              style={{
                background: T.surface2,
                borderRadius: 8,
                padding: "9px 10px",
                margin: "10px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>Note:</strong> {entry.note}
            </p>
          )}
          {!editing && (
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  background: "none",
                  border: 0,
                  color: entry.color,
                  font: `700 11px ${font}`,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Edit entry
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                style={{
                  background: "none",
                  border: 0,
                  color: T.red,
                  font: `700 11px ${font}`,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )}
          {confirmingDelete && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 10,
                color: T.muted,
                fontSize: 11,
              }}
            >
              Delete this entry?
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                style={{
                  border: 0,
                  borderRadius: 7,
                  background: T.red,
                  color: "#fff",
                  padding: "6px 9px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                style={{ border: 0, background: "none", color: T.muted, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          )}
          {editing && (
            <ActivityDetailEditor
              entry={entry}
              onSave={(updates) => {
                onUpdate(entry.id, updates);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          )}
        </div>
      )}
    </article>
  );
}
