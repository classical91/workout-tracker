import { useEffect, useRef, useState } from "react";
import { T, font, display } from "../theme.js";
import { breathModes } from "../data/breathing.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { TimerCircle } from "../components/TimerCircle.jsx";

export function BreathingScreen({ onBack, onAddActivity, onUpdateActivity }) {
  const [modeIndex, setModeIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [completedActivity, setCompletedActivity] = useState(null);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);
  const mode = breathModes[modeIndex];
  const durations = mode.durations;

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const start = () => {
    if (!sessionStarted) {
      setStepIndex(0);
      setCountdown(durations[0]);
      setCycles(0);
      startedAtRef.current = Date.now();
      setSessionStarted(true);
    }
    setRunning(true);
  };

  const resetSession = () => {
    stop();
    setStepIndex(0);
    setCountdown(0);
    setCycles(0);
    setSessionStarted(false);
    setCompletedActivity(null);
    startedAtRef.current = null;
  };

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          setStepIndex((previousStep) => {
            const next = (previousStep + 1) % durations.length;
            if (next === 0) setCycles((value) => value + 1);
            return next;
          });
          return durations[(stepIndex + 1) % durations.length];
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [durations, running, stepIndex]);

  const finishAndLog = () => {
    stop();
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const activity = onAddActivity({
      type: ACTIVITY_TYPES.BREATHING,
      category: ACTIVITY_CATEGORIES.BREATHING,
      name: `${mode.name} Breathing`,
      emoji: "🌬️",
      color: mode.color,
      duration: `${minutes} min`,
      completed: true,
      details: {
        technique: mode.name,
        rounds: cycles,
        inhaleSeconds: durations[0] || "",
        holdSeconds: mode.steps[1] === "Hold" ? durations[1] : "",
        exhaleSeconds: durations[mode.steps.indexOf("Exhale")] || "",
        secondHoldSeconds: mode.steps.lastIndexOf("Hold") > 1 ? durations.at(-1) : "",
        completedTimer: true,
      },
    });
    setCompletedActivity(activity);
    setSessionStarted(false);
  };

  const stepDuration = durations[stepIndex] || 1;
  const pct = running ? ((stepDuration - countdown) / stepDuration) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text }}>
      <ScreenHeader
        title="Breathing"
        subtitle="BREATHWORK"
        emoji="🌬️"
        color={mode.color}
        onBack={() => {
          stop();
          onBack();
        }}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {breathModes.map((breathMode, index) => (
            <button
              type="button"
              key={breathMode.name}
              aria-pressed={modeIndex === index}
              onClick={() => {
                resetSession();
                setModeIndex(index);
              }}
              style={{
                flex: 1,
                background: modeIndex === index ? `${breathMode.color}18` : T.surface,
                border: `2px solid ${modeIndex === index ? breathMode.color : T.border}`,
                borderRadius: 10,
                padding: "10px 4px",
                cursor: "pointer",
                color: modeIndex === index ? breathMode.color : T.muted,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: font,
              }}
            >
              {breathMode.name}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, textAlign: "center", marginBottom: 24 }}>
          {mode.desc}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <TimerCircle
            size={200}
            radius={80}
            viewBox="0 0 180 180"
            cx={90}
            cy={90}
            strokeWidth={6}
            color={mode.color}
            pct={pct}
            smooth={false}
          >
            {sessionStarted ? (
              <>
                <div
                  style={{ fontFamily: display, fontSize: 42, color: mode.color, lineHeight: 1 }}
                >
                  {countdown}
                </div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 700, marginTop: 4 }}>
                  {mode.steps[stepIndex]}
                </div>
              </>
            ) : (
              <div style={{ fontFamily: display, fontSize: 32, color: T.muted }}>READY</div>
            )}
          </TimerCircle>
          {sessionStarted && (
            <p style={{ fontSize: 12, color: T.muted }}>Completed rounds: {cycles}</p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={running ? stop : start}
              style={{
                background: running ? `${mode.color}22` : mode.color,
                border: `2px solid ${mode.color}`,
                borderRadius: 12,
                padding: "12px 28px",
                fontFamily: display,
                fontSize: 20,
                color: running ? mode.color : "#000",
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              {running ? "PAUSE" : sessionStarted ? "RESUME" : "START"}
            </button>
            {sessionStarted && (
              <button
                type="button"
                onClick={finishAndLog}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "12px 18px",
                  color: T.text,
                  fontFamily: font,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Finish & log
              </button>
            )}
          </div>
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: T.muted,
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              PATTERN
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {mode.steps.map((step, index) => (
                <div
                  key={`${step}-${index}`}
                  style={{
                    flex: 1,
                    background: running && stepIndex === index ? `${mode.color}22` : T.surface2,
                    border: `1px solid ${running && stepIndex === index ? mode.color : T.border}`,
                    borderRadius: 10,
                    padding: "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: display, fontSize: 24, color: mode.color }}>
                    {mode.durations[index]}s
                  </div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
          {completedActivity && (
            <ActivityCompletionForm
              activity={completedActivity}
              onSave={(updates) => {
                onUpdateActivity(completedActivity.id, updates);
                setCompletedActivity(null);
              }}
              onSkip={() => setCompletedActivity(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
