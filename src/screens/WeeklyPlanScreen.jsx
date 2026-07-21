import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { weeklyPlan } from "../data/weeklyPlan.js";

// weeklyPlan is ordered Mon–Sun; Date.getDay() is Sun-first, so remap.
const todayIndex = () => (new Date().getDay() + 6) % 7;

function PlanItem({ item, color, onNavigate }) {
  const clickable = !!item.screen;
  const Tag = clickable ? "button" : "div";
  return (
    <Tag
      {...(clickable ? { type: "button", onClick: () => onNavigate(item.screen) } : {})}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        boxSizing: "border-box",
        background: T.surface2,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        marginTop: 8,
        color: T.text,
        font: "inherit",
        textAlign: "left",
        cursor: clickable ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (clickable) e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{item.detail}</div>
      </div>
      {clickable && (
        <span style={{ color, fontSize: 16, flexShrink: 0 }} aria-hidden>
          ›
        </span>
      )}
    </Tag>
  );
}

function DayCard({ plan, isToday, onNavigate }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${isToday ? plan.color : T.border}`,
        borderLeft: `3px solid ${plan.color}`,
        borderRadius: 14,
        padding: "14px 16px 16px",
        marginBottom: 12,
        boxShadow: isToday ? `0 0 0 1px ${plan.color}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>{plan.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: display, fontSize: 20, letterSpacing: 1, color: plan.color }}>
              {plan.day}
            </span>
            {isToday && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: T.bg,
                  background: plan.color,
                  borderRadius: 99,
                  padding: "3px 8px",
                }}
              >
                TODAY
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1, fontWeight: 600 }}>
            {plan.theme.toUpperCase()} · {plan.focus.toUpperCase()}
          </div>
        </div>
      </div>
      {plan.items.map((item) => (
        <PlanItem key={item.name} item={item} color={plan.color} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export function WeeklyPlanScreen({ onBack, onNavigate }) {
  const today = todayIndex();
  // Show today's card first so the day's plan is always at the top,
  // then the rest of the week in order.
  const ordered = [...weeklyPlan.slice(today), ...weeklyPlan.slice(0, today)];

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
        title="Weekly Plan"
        subtitle="SET SCHEDULE · MON–SUN"
        emoji="📅"
        color={T.purple}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 16 }}>
          The same rhythm every week: three dumbbell days, two easy-movement days, one recovery day
          and one full rest day. Today is always on top — tap any item to jump straight in.
        </p>
        {ordered.map((plan, i) => (
          <DayCard key={plan.day} plan={plan} isToday={i === 0} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
