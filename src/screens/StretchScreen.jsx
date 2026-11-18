import { useEffect, useRef, useState } from "react";
import { T, font } from "../theme.js";
import { StretchIllus, stretchCheckKey, stretchSections } from "../data/stretches.js";
import { STRETCH_GROUP } from "../data/liveLogGroups.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { DailyFocusPrompt } from "../components/DailyFocusPrompt.jsx";
import { stretchDailyFocus } from "../utils/dailyFocus.js";

const allItems = stretchSections.flatMap((section) => section.items);

// "All" plus one filter per body-region section, so the list can be narrowed
// without changing which stretches are counted, checked, or logged.
const REGION_FILTERS = [{ label: "All", color: T.green }, ...stretchSections];

// Each checkmark is logged the moment it's made (see useLiveCheckLog): today's
// stretches share one log entry that grows and shrinks with the checks. This
// screen only offers the optional details form once the full routine is done.
export function StretchScreen({
  onBack,
  checked,
  setChecked,
  getLiveActivity = () => null,
  onUpdateActivity,
  onAddDailyFocus,
  onRemoveDailyFocus,
}) {
  const done = allItems.filter((item) => checked[stretchCheckKey(item)]).length;
  const previousDone = useRef(done);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingFocus, setPendingFocus] = useState(null);
  // Which body-region section to show ("All" or one of stretchSections' labels).
  // Purely a display filter — checking, counting, and logging always consider
  // every stretch regardless of what's currently visible.
  const [regionFilter, setRegionFilter] = useState("All");
  const visibleSections =
    regionFilter === "All"
      ? stretchSections
      : stretchSections.filter((section) => section.label === regionFilter);
  const liveActivity = getLiveActivity(STRETCH_GROUP);

  const toggleStretch = (item, color) => {
    const key = stretchCheckKey(item);
    const willCheck = !checked[key];
    setChecked((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    if (willCheck) {
      setPendingFocus({ focus: stretchDailyFocus(item), color });
    } else {
      if (pendingFocus?.focus.id === `stretch:${item.key}`) setPendingFocus(null);
      onRemoveDailyFocus?.(`stretch:${item.key}`);
    }
  };

  const selectDailyFocus = () => {
    onAddDailyFocus?.(pendingFocus.focus);
    setPendingFocus(null);
  };

  // Offer the details form the moment the full routine is finished; hide it
  // again if a stretch is unchecked before it's filled in.
  useEffect(() => {
    if (done === allItems.length && previousDone.current < allItems.length) setShowDetails(true);
    if (done < allItems.length) setShowDetails(false);
    previousDone.current = done;
  }, [done]);

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
        title="Stretch"
        subtitle="FLEXIBILITY · 10 MIN"
        emoji="🧘"
        color={T.green}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={allItems.length} color={T.green} />
        <div
          aria-label="Filter by body region"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            paddingBottom: 14,
          }}
        >
          {REGION_FILTERS.map((section) => {
            const active = regionFilter === section.label;
            return (
              <button
                type="button"
                key={section.label}
                aria-current={active ? "true" : undefined}
                onClick={() => setRegionFilter(section.label)}
                style={{
                  flex: "0 0 auto",
                  border: `1px solid ${active ? section.color : T.border}`,
                  background: active ? `${section.color}18` : T.surface,
                  color: active ? section.color : T.muted,
                  borderRadius: 99,
                  padding: "7px 11px",
                  fontFamily: font,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 150ms ease, border-color 150ms ease",
                }}
              >
                {section.label}
              </button>
            );
          })}
        </div>
        {visibleSections.map((section) => (
          <div key={section.label}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: section.color,
                fontWeight: 700,
                marginBottom: 10,
                marginTop: 8,
              }}
            >
              {section.label.toUpperCase()}
            </p>
            {section.items.map((item) => (
              <IllusCard
                key={item.key}
                label={item.name}
                muscles={item.muscles}
                detail={item.detail}
                reps={item.hold}
                color={section.color}
                done={Boolean(checked[stretchCheckKey(item)])}
                onToggle={() => toggleStretch(item, section.color)}
                illusKey={item.name}
                IllusMap={StretchIllus}
                link={`https://www.google.com/search?udm=2&q=${encodeURIComponent(`${item.name} stretch`)}`}
              />
            ))}
          </div>
        ))}
        {done === allItems.length && (
          <CompletionBanner color={T.green} emoji="🌿" text="FULLY STRETCHED!" />
        )}
        {done > 0 && (
          <p style={{ fontSize: 11, color: T.muted, textAlign: "center", margin: "4px 0 12px" }}>
            ✓ Saved to your log as you check
          </p>
        )}
        {showDetails && liveActivity && (
          <ActivityCompletionForm
            key={liveActivity.id}
            activity={liveActivity}
            onSave={(updates) => {
              onUpdateActivity(liveActivity.id, updates);
              setShowDetails(false);
            }}
            onSkip={() => setShowDetails(false)}
          />
        )}
      </div>
      <DailyFocusPrompt
        focus={pendingFocus?.focus}
        color={pendingFocus?.color || T.green}
        onConfirm={selectDailyFocus}
        onDismiss={() => setPendingFocus(null)}
      />
    </div>
  );
}
