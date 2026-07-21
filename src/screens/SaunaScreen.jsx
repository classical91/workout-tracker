import { useState } from "react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { T, font } from "../theme.js";

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: T.bg,
  border: `1px solid ${T.border}`,
  borderRadius: 9,
  color: T.text,
  fontFamily: font,
  fontSize: 13,
  padding: "10px 11px",
};

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6, color: T.muted, fontSize: 11 }}>
      {label}
      {children}
    </label>
  );
}

const optionalNumber = (value) => (value === "" ? undefined : Number(value));

export function SaunaScreen({ onBack, onAddActivity }) {
  const [duration, setDuration] = useState("20");
  const [rounds, setRounds] = useState("");
  const [temperature, setTemperature] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("C");
  const [coldExposureAfter, setColdExposureAfter] = useState(false);
  const [feelingBefore, setFeelingBefore] = useState("");
  const [feelingAfter, setFeelingAfter] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = (event) => {
    event.preventDefault();
    const minutes = Number(duration);
    const roundCount = optionalNumber(rounds);
    const temp = optionalNumber(temperature);
    const maxTemperature = temperatureUnit === "C" ? 120 : 250;
    const minTemperature = temperatureUnit === "C" ? 40 : 100;

    if (!Number.isFinite(minutes) || minutes < 0) return setError("Enter a valid duration.");
    if (roundCount != null && (!Number.isFinite(roundCount) || roundCount < 0))
      return setError("Rounds cannot be negative.");
    if (temp != null && (!Number.isFinite(temp) || temp < minTemperature || temp > maxTemperature))
      return setError(
        `Use a temperature between ${minTemperature}° and ${maxTemperature}°${temperatureUnit}.`
      );

    onAddActivity({
      type: ACTIVITY_TYPES.SAUNA,
      category: ACTIVITY_CATEGORIES.HEAT,
      name: "Sauna",
      emoji: "🧖",
      color: T.red,
      duration: `${minutes} min`,
      completed: true,
      note: note.trim(),
      details: {
        totalMinutes: minutes,
        rounds: roundCount ?? "",
        temperature: temp ?? "",
        temperatureUnit,
        coldExposureAfter,
        feelingBefore: feelingBefore.trim(),
        feelingAfter: feelingAfter.trim(),
      },
    });
    setError("");
    setSaved(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: font,
        paddingBottom: 50,
      }}
    >
      <ScreenHeader
        title="Sauna"
        subtitle="HEAT RECOVERY"
        emoji="🧖"
        color={T.red}
        onBack={onBack}
      />
      <form onSubmit={save} style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
          Log the essentials now. Every field except duration is optional.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <Field label="Duration (minutes)">
            <input
              type="number"
              min="0"
              required
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              style={fieldStyle}
            />
          </Field>
          <Field label="Rounds">
            <input
              type="number"
              min="0"
              value={rounds}
              onChange={(event) => setRounds(event.target.value)}
              style={fieldStyle}
            />
          </Field>
          <Field label="Temperature">
            <input
              type="number"
              min={temperatureUnit === "C" ? 40 : 100}
              max={temperatureUnit === "C" ? 120 : 250}
              value={temperature}
              onChange={(event) => setTemperature(event.target.value)}
              style={fieldStyle}
            />
          </Field>
          <Field label="Temperature unit">
            <select
              value={temperatureUnit}
              onChange={(event) => setTemperatureUnit(event.target.value)}
              style={fieldStyle}
            >
              <option value="C">Celsius</option>
              <option value="F">Fahrenheit</option>
            </select>
          </Field>
          <Field label="Feeling before">
            <input
              value={feelingBefore}
              onChange={(event) => setFeelingBefore(event.target.value)}
              placeholder="Tense"
              style={fieldStyle}
            />
          </Field>
          <Field label="Feeling after">
            <input
              value={feelingAfter}
              onChange={(event) => setFeelingAfter(event.target.value)}
              placeholder="Relaxed"
              style={fieldStyle}
            />
          </Field>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            color: T.muted,
            fontSize: 12,
            marginTop: 14,
          }}
        >
          <input
            type="checkbox"
            checked={coldExposureAfter}
            onChange={(event) => setColdExposureAfter(event.target.checked)}
          />
          Cold exposure afterward
        </label>
        <Field label="Session note">
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Hydration, how it felt, anything to remember…"
            style={{ ...fieldStyle, resize: "vertical", marginTop: 14 }}
          />
        </Field>
        {error && (
          <p role="alert" style={{ color: T.red, fontSize: 12, marginTop: 10 }}>
            {error}
          </p>
        )}
        {saved && (
          <p role="status" style={{ color: T.green, fontSize: 12, marginTop: 10 }}>
            Sauna session saved to Activity Log.
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 16,
            background: T.red,
            border: 0,
            borderRadius: 11,
            padding: 13,
            color: "#fff",
            fontFamily: font,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Save sauna session
        </button>
      </form>
    </div>
  );
}
