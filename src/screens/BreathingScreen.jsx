import { useState, useEffect, useRef } from "react";
import { T, font, display } from "../theme.js";
import { breathModes } from "../data/breathing.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { TimerCircle } from "../components/TimerCircle.jsx";

export function BreathingScreen({ onBack }) {
  const [mi, setMi] = useState(0);
  const [running, setRunning] = useState(false);
  const [si, setSi] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const ref = useRef(null);
  const m = breathModes[mi];
  const durations = m.durations;

  const stop = () => {
    setRunning(false);
    clearInterval(ref.current);
  };
  const start = () => {
    setSi(0);
    setCountdown(durations[0]);
    setCycles(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setSi((s) => {
            const next = (s + 1) % durations.length;
            if (next === 0) setCycles((cy) => cy + 1);
            return next;
          });
          return durations[(si + 1) % durations.length];
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [durations, running, si]);

  const dur = durations[si] || 1;
  const pct = running ? ((dur - countdown) / dur) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text }}>
      <ScreenHeader
        title="Breathing"
        subtitle="BREATHWORK"
        emoji="🌬️"
        color={m.color}
        onBack={() => {
          stop();
          onBack();
        }}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {breathModes.map((bm, i) => (
            <button
              key={i}
              onClick={() => {
                stop();
                setMi(i);
                setSi(0);
                setCountdown(0);
                setCycles(0);
              }}
              style={{
                flex: 1,
                background: mi === i ? `${bm.color}18` : T.surface,
                border: `2px solid ${mi === i ? bm.color : T.border}`,
                borderRadius: 10,
                padding: "10px 4px",
                cursor: "pointer",
                color: mi === i ? bm.color : T.muted,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: font,
              }}
            >
              {bm.name}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, textAlign: "center", marginBottom: 24 }}>
          {m.desc}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <TimerCircle
            size={200}
            radius={80}
            viewBox="0 0 180 180"
            cx={90}
            cy={90}
            strokeWidth={6}
            color={m.color}
            pct={pct}
            smooth={false}
          >
            {running ? (
              <>
                <div style={{ fontFamily: display, fontSize: 42, color: m.color, lineHeight: 1 }}>
                  {countdown}
                </div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 700, marginTop: 4 }}>
                  {m.steps[si]}
                </div>
              </>
            ) : (
              <div style={{ fontFamily: display, fontSize: 32, color: T.muted }}>READY</div>
            )}
          </TimerCircle>
          {running && <p style={{ fontSize: 12, color: T.muted }}>Cycles: {cycles}</p>}
          <button
            onClick={running ? stop : start}
            style={{
              background: running ? `${m.color}22` : m.color,
              border: `2px solid ${m.color}`,
              borderRadius: 12,
              padding: "12px 32px",
              fontFamily: display,
              fontSize: 20,
              color: running ? m.color : "#000",
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            {running ? "STOP" : "START"}
          </button>
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              width: "100%",
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
              {m.steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: running && si === i ? `${m.color}22` : T.surface2,
                    border: `1px solid ${running && si === i ? m.color : T.border}`,
                    borderRadius: 10,
                    padding: "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: display, fontSize: 24, color: m.color }}>
                    {m.durations[i]}s
                  </div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
