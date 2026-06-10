import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import {
  workoutSetBenefits,
  sharedWorkoutBenefits,
  simpleBenefits,
  stretchBenefits,
} from "../data/benefits.js";

function SectionTitle({ text, color }) {
  return (
    <h2
      style={{
        fontFamily: display,
        fontSize: 24,
        color,
        letterSpacing: 1,
        margin: "28px 0 12px",
      }}
    >
      {text}
    </h2>
  );
}

function BenefitList({ points, color }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {points.map((p, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 8,
            fontSize: 13,
            lineHeight: 1.5,
            color: T.text,
          }}
        >
          <span style={{ color, flexShrink: 0, fontWeight: 700 }}>✓</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ children, color }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

export function BenefitsScreen({ onBack }) {
  const color = T.teal;

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
        title="Why It Works"
        subtitle="BENEFITS · WORKOUTS · STRETCHES"
        emoji="💡"
        color={color}
        onBack={onBack}
      />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 4 }}>
          A quick guide to what each part of your daily practice does for your body — so you know
          exactly why you&apos;re doing it.
        </p>

        {/* Workout Sets */}
        <SectionTitle text="Workout Sets" color={T.orange} />
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 12 }}>
          Three dumbbell routines that build strength across the whole body.
        </p>
        {workoutSetBenefits.map((w) => (
          <Card key={w.id} color={w.color}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{w.emoji}</span>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: w.color,
                    background: `${w.color}18`,
                    borderRadius: 99,
                    padding: "3px 9px",
                  }}
                >
                  {w.tag}
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{w.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.5, color: T.muted, marginBottom: 10 }}>
              {w.summary}
            </p>
            <BenefitList points={w.points} color={w.color} />
          </Card>
        ))}
        <Card color={T.teal}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: T.teal }}>
            Every routine includes
          </div>
          <BenefitList points={sharedWorkoutBenefits} color={T.teal} />
        </Card>

        {/* Simple Workouts */}
        <SectionTitle text="Simple Workouts" color={T.blue} />
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 12 }}>
          {simpleBenefits.summary}
        </p>
        <Card color={T.blue}>
          <BenefitList points={simpleBenefits.points} color={T.blue} />
        </Card>

        {/* Stretches */}
        <SectionTitle text="Stretches" color={T.green} />
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 12 }}>
          {stretchBenefits.summary}
        </p>
        <Card color={T.green}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: T.green }}>
            What stretching gives you
          </div>
          <BenefitList points={stretchBenefits.general} color={T.green} />
        </Card>
        {stretchBenefits.sections.map((s) => (
          <Card key={s.label} color={s.color}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: s.color }}>
              {s.label}
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: T.text, margin: 0 }}>
              {s.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
