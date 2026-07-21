import { ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { T, font } from "../theme.js";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: T.bg,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.text,
  fontFamily: font,
  fontSize: 13,
  padding: "9px 10px",
};

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 5, fontSize: 11, color: T.muted }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextField({ label, value = "", onChange, type = "text", min, max, placeholder }) {
  return (
    <Field label={label}>
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </Field>
  );
}

const numberOrEmpty = (value, { min = 0, max = Number.POSITIVE_INFINITY } = {}) => {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return Math.min(max, Math.max(min, parsed));
};

export function ActivityDetailFields({ type, details, onChange }) {
  const set = (key, value) => onChange({ ...details, [key]: value });
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 };

  if (type === ACTIVITY_TYPES.SAUNA) {
    return (
      <div style={gridStyle}>
        <TextField
          label="Rounds"
          type="number"
          min="0"
          value={details.rounds ?? ""}
          onChange={(value) => set("rounds", numberOrEmpty(value))}
        />
        <TextField
          label="Temperature"
          type="number"
          min="40"
          max="230"
          value={details.temperature ?? ""}
          onChange={(value) => set("temperature", numberOrEmpty(value, { min: 40, max: 230 }))}
        />
        <Field label="Temperature unit">
          <select
            value={details.temperatureUnit || "C"}
            onChange={(event) => set("temperatureUnit", event.target.value)}
            style={inputStyle}
          >
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
          </select>
        </Field>
        <label
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: T.muted }}
        >
          <input
            type="checkbox"
            checked={Boolean(details.coldExposureAfter)}
            onChange={(event) => set("coldExposureAfter", event.target.checked)}
          />
          Cold exposure afterward
        </label>
        <TextField
          label="Feeling before"
          value={details.feelingBefore || ""}
          onChange={(value) => set("feelingBefore", value)}
        />
        <TextField
          label="Feeling after"
          value={details.feelingAfter || ""}
          onChange={(value) => set("feelingAfter", value)}
        />
      </div>
    );
  }

  if (type === ACTIVITY_TYPES.BREATHING || type === ACTIVITY_TYPES.OHMING) {
    return (
      <div style={gridStyle}>
        <TextField
          label="Technique"
          value={details.technique || ""}
          onChange={(value) => set("technique", value)}
        />
        <TextField
          label="Rounds"
          type="number"
          min="0"
          value={details.rounds ?? ""}
          onChange={(value) => set("rounds", numberOrEmpty(value))}
        />
        {[
          ["inhaleSeconds", "Inhale seconds"],
          ["holdSeconds", "Hold seconds"],
          ["exhaleSeconds", "Exhale seconds"],
          ["secondHoldSeconds", "Second hold seconds"],
        ].map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            type="number"
            min="0"
            value={details[key] ?? ""}
            onChange={(value) => set(key, numberOrEmpty(value))}
          />
        ))}
        <TextField
          label="Feeling before"
          value={details.feelingBefore || ""}
          onChange={(value) => set("feelingBefore", value)}
        />
        <TextField
          label="Feeling after"
          value={details.feelingAfter || ""}
          onChange={(value) => set("feelingAfter", value)}
        />
      </div>
    );
  }

  if ([ACTIVITY_TYPES.MEDITATION, ACTIVITY_TYPES.BODY_SCAN].includes(type)) {
    return (
      <div style={gridStyle}>
        <TextField
          label="Technique"
          value={details.technique || ""}
          onChange={(value) => set("technique", value)}
        />
        <TextField
          label="Focus quality"
          value={details.focusQuality || ""}
          onChange={(value) => set("focusQuality", value)}
        />
        <TextField
          label="Mood before"
          value={details.moodBefore || ""}
          onChange={(value) => set("moodBefore", value)}
        />
        <TextField
          label="Mood after"
          value={details.moodAfter || ""}
          onChange={(value) => set("moodAfter", value)}
        />
        <TextField
          label="Interruptions"
          type="number"
          min="0"
          value={details.interruptions ?? ""}
          onChange={(value) => set("interruptions", numberOrEmpty(value))}
        />
      </div>
    );
  }

  if (
    [
      ACTIVITY_TYPES.FOAM_ROLLING,
      ACTIVITY_TYPES.TRIGGER_POINTS,
      ACTIVITY_TYPES.REFLEXOLOGY,
      ACTIVITY_TYPES.RECOVERY,
    ].includes(type)
  ) {
    return (
      <div style={gridStyle}>
        <TextField
          label="Body areas"
          value={details.bodyAreas?.join(", ") || ""}
          placeholder="Upper back, glutes"
          onChange={(value) =>
            set(
              "bodyAreas",
              value
                .split(",")
                .map((area) => area.trim())
                .filter(Boolean)
            )
          }
        />
        <TextField
          label="Pressure"
          value={details.pressure || ""}
          onChange={(value) => set("pressure", value)}
        />
        <TextField
          label="Tender points"
          type="number"
          min="0"
          value={details.tenderPoints ?? ""}
          onChange={(value) => set("tenderPoints", numberOrEmpty(value))}
        />
        <TextField
          label="Relief after"
          value={details.reliefAfter || ""}
          onChange={(value) => set("reliefAfter", value)}
        />
      </div>
    );
  }

  if (type === ACTIVITY_TYPES.STRETCH) {
    return (
      <div style={gridStyle}>
        <TextField
          label="Body areas"
          value={details.bodyAreas?.join(", ") || ""}
          placeholder="Hips, hamstrings"
          onChange={(value) =>
            set(
              "bodyAreas",
              value
                .split(",")
                .map((area) => area.trim())
                .filter(Boolean)
            )
          }
        />
        <TextField
          label="Intensity"
          value={details.intensity || ""}
          onChange={(value) => set("intensity", value)}
        />
      </div>
    );
  }

  if (type === ACTIVITY_TYPES.WORKOUT || type === ACTIVITY_TYPES.EXERCISE) {
    const exercises = details.exercises || details.plannedExercises || [];
    return (
      <div style={{ display: "grid", gap: 10 }}>
        {exercises.map((exercise, index) => {
          const updateExercise = (key, value) => {
            const next = exercises.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item
            );
            onChange({ ...details, exercises: next, plannedExercises: undefined });
          };
          return (
            <div
              key={`${exercise.name}-${index}`}
              style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                {exercise.name || `Exercise ${index + 1}`}
              </div>
              <div style={gridStyle}>
                <TextField
                  label="Sets"
                  type="number"
                  min="0"
                  value={exercise.setCount ?? ""}
                  onChange={(value) => updateExercise("setCount", numberOrEmpty(value))}
                />
                <TextField
                  label="Reps"
                  type="number"
                  min="0"
                  value={exercise.reps ?? ""}
                  onChange={(value) => updateExercise("reps", numberOrEmpty(value))}
                />
                <TextField
                  label="Weight"
                  type="number"
                  min="0"
                  value={exercise.weight ?? ""}
                  onChange={(value) => updateExercise("weight", numberOrEmpty(value))}
                />
                <Field label="Weight unit">
                  <select
                    value={exercise.weightUnit || "lb"}
                    onChange={(event) => updateExercise("weightUnit", event.target.value)}
                    style={inputStyle}
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="bodyweight">bodyweight</option>
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 8 }}>
                <TextField
                  label="Exercise note"
                  value={exercise.note || ""}
                  onChange={(value) => updateExercise("note", value)}
                />
              </div>
            </div>
          );
        })}
        {exercises.length === 0 && (
          <p style={{ color: T.muted, fontSize: 12 }}>
            No exercise details were saved for this entry.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      <TextField
        label="Feeling before"
        value={details.feelingBefore || ""}
        onChange={(value) => set("feelingBefore", value)}
      />
      <TextField
        label="Feeling after"
        value={details.feelingAfter || ""}
        onChange={(value) => set("feelingAfter", value)}
      />
    </div>
  );
}

export { inputStyle };
