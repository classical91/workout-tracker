import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { excuses } from "../data/excuses.js";

function ExcuseCard({ item, onNavigate }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${item.color}`,
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{item.emoji}</span>
        <span
          style={{
            fontFamily: display,
            fontSize: 20,
            letterSpacing: 0.5,
            color: item.color,
            lineHeight: 1.1,
          }}
        >
          &ldquo;{item.excuse}&rdquo;
        </span>
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: T.text, margin: "0 0 12px" }}>
        {item.comeback}
      </p>
      <button
        type="button"
        onClick={() => onNavigate(item.action.screen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${item.color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${item.color}18`;
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: `${item.color}18`,
          color: item.color,
          border: `1px solid ${item.color}40`,
          borderRadius: 99,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          fontFamily: font,
          cursor: "pointer",
        }}
      >
        {item.action.label} <span aria-hidden>›</span>
      </button>
    </div>
  );
}

export function ExcusesScreen({ onBack, onNavigate }) {
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
        title="No Excuses"
        subtitle="EXCUSE BUSTERS · READ, THEN MOVE"
        emoji="🙅"
        color={T.red}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 16 }}>
          Every excuse here is real — and every one has a smaller move that still counts. Find
          yours, read the comeback, then tap the button and do the small thing.
        </p>
        {excuses.map((item) => (
          <ExcuseCard key={item.id} item={item} onNavigate={onNavigate} />
        ))}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "16px 18px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: display, fontSize: 22, letterSpacing: 1, color: T.teal }}>
            THE RULE OF NEVER ZERO
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: T.muted, margin: "6px 0 0" }}>
            On the worst days, do one stretch, one set, or one minute of breathing. A tiny session
            keeps the habit alive; a zero day teaches you how to quit.
          </p>
        </div>
      </div>
    </div>
  );
}
