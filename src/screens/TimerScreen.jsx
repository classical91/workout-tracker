import { useState, useEffect, useRef } from "react";
import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { TimerCircle } from "../components/TimerCircle.jsx";

export function TimerScreen({
  title,
  subtitle,
  emoji,
  color,
  defaultMins,
  onBack,
  onComplete,
  note,
}) {
  const total = defaultMins * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining((r) => r - 1), 1000);
    } else if (remaining === 0 && running) {
      setRunning(false);
      setDone(true);
      if (onComplete) onComplete();
    }
    return () => clearInterval(ref.current);
  }, [running, remaining]);

  const reset = () => {
    setRemaining(total);
    setRunning(false);
    setDone(false);
  };

  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const pct = ((total - remaining) / total) * 100;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text }}>
      <ScreenHeader title={title} subtitle={subtitle} emoji={emoji} color={color} onBack={onBack} />
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: "20px 20px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <TimerCircle color={color} pct={pct}>
          <div
            style={{
              fontFamily: display,
              fontSize: 48,
              color: done ? color : T.text,
              lineHeight: 1,
            }}
          >
            {done ? "DONE" : `${mins}:${secs}`}
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1, marginTop: 4 }}>
            {done ? "🎉" : running ? "RUNNING" : "READY"}
          </div>
        </TimerCircle>
        <div style={{ display: "flex", gap: 12 }}>
          {!done && (
            <button
              onClick={() => setRunning((r) => !r)}
              style={{
                background: running ? `${color}22` : color,
                border: `2px solid ${color}`,
                borderRadius: 12,
                padding: "12px 32px",
                fontFamily: display,
                fontSize: 20,
                color: running ? color : "#000",
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              {running ? "PAUSE" : "START"}
            </button>
          )}
          <button
            onClick={reset}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "12px 24px",
              fontFamily: font,
              fontSize: 13,
              color: T.muted,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
        {note && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              width: "100%",
              fontSize: 13,
              color: T.muted,
              lineHeight: 1.6,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
