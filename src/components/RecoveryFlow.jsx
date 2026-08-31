import { useMemo, useRef, useState } from "react";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import {
  BODY_CHECK_INS,
  BODY_REGIONS,
  KNOT_TREATMENT_SEQUENCES,
  RECOVERY_TOOL_CONFIG,
  musclesFromExercises,
} from "../data/recovery.js";
import { getRecoveryRecommendation } from "../utils/recoveryRecommendation.js";
import { T, display, font } from "../theme.js";

const stepButtonStyle = (active, color) => ({
  width: "100%",
  minHeight: 44,
  padding: "11px 13px",
  borderRadius: 10,
  border: `1px solid ${active ? color : T.border}`,
  background: active ? `${color}18` : T.surface2,
  color: active ? color : T.text,
  fontFamily: font,
  fontSize: 12,
  fontWeight: 700,
  textAlign: "left",
  cursor: "pointer",
});

const primaryButtonStyle = (color) => ({
  flex: 1,
  minHeight: 44,
  padding: "11px 14px",
  border: 0,
  borderRadius: 10,
  background: color,
  color: "#000",
  fontFamily: font,
  fontWeight: 800,
  cursor: "pointer",
});

const secondaryButtonStyle = {
  minHeight: 44,
  padding: "11px 14px",
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  background: "transparent",
  color: T.muted,
  fontFamily: font,
  fontWeight: 700,
  cursor: "pointer",
};

function SectionTitle({ eyebrow, title, copy, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ margin: 0, color, fontSize: 9, fontWeight: 800, letterSpacing: 2 }}>{eyebrow}</p>
      <h3 style={{ margin: "5px 0 4px", fontFamily: display, fontSize: 26, letterSpacing: 0.6 }}>
        {title}
      </h3>
      {copy && <p style={{ margin: 0, color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{copy}</p>}
    </div>
  );
}

export function RecoveryFlow({ workoutActivity, activityLog = [], onAddActivity, onClose }) {
  const color = "#4ECDC4";
  const trainedMuscles = useMemo(
    () => musclesFromExercises(workoutActivity?.details?.exercises || []),
    [workoutActivity]
  );
  const [stage, setStage] = useState("stretch");
  const [stretchingCompleted, setStretchingCompleted] = useState(false);
  const [bodyCheckIn, setBodyCheckIn] = useState(null);
  const [problemArea, setProblemArea] = useState(null);
  const [knotTreatmentCompleted, setKnotTreatmentCompleted] = useState(false);
  const [afterState, setAfterState] = useState(null);
  const [toolsUsed, setToolsUsed] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showOtherTools, setShowOtherTools] = useState(false);
  const saved = useRef(false);

  const recommendation = useMemo(
    () =>
      getRecoveryRecommendation({
        trainedMuscles,
        bodyCheckIn,
        problemArea,
        recentRecoveryHistory: activityLog,
      }),
    [activityLog, bodyCheckIn, problemArea, trainedMuscles]
  );

  const finish = (nextTools = toolsUsed) => {
    if (saved.current) return;
    saved.current = true;
    const meaningful =
      stretchingCompleted || bodyCheckIn || knotTreatmentCompleted || nextTools.length > 0;
    if (meaningful) {
      const labels = nextTools.map((tool) => RECOVERY_TOOL_CONFIG[tool].label);
      onAddActivity({
        type: ACTIVITY_TYPES.RECOVERY,
        category: ACTIVITY_CATEGORIES.RECOVERY,
        name: labels.length ? `Stretch + ${labels.join(" + ")}` : "Workout Recovery",
        emoji: "✨",
        color,
        duration: stretchingCompleted ? recommendation.stretchDuration.label : "",
        completed: true,
        details: {
          date: new Date().toISOString(),
          stretchingCompleted,
          stretchDuration: stretchingCompleted ? recommendation.stretchDuration.minutes : 0,
          stretchType: recommendation.stretchingType,
          trainedMuscles,
          recoveryToolsUsed: nextTools,
          bodyCheckIn,
          problemArea,
          knotTreatmentCompleted,
          beforeState: bodyCheckIn,
          afterState,
          relatedWorkoutId: workoutActivity?.details?.workoutId || null,
          relatedWorkoutActivityId: workoutActivity?.id || null,
        },
      });
    }
    setStage("complete");
  };

  const chooseCheckIn = (id) => {
    setBodyCheckIn(id);
    if (id === "feeling_good") setStage("extra");
    else setStage("offer_help");
  };

  const acceptHelp = () => {
    if (bodyCheckIn === "muscle_knot" || bodyCheckIn === "tight_stiff") setStage("region");
    else {
      if (bodyCheckIn === "head_neck_tension") setProblemArea("neck");
      setStage("treatment");
    }
  };

  const selectTool = (tool) => {
    setSelectedTool(tool);
    setStage("tool");
  };

  return (
    <section
      aria-label="Post-workout recovery"
      style={{
        marginTop: 14,
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${color}55`,
        background: `linear-gradient(145deg, ${color}12, ${T.surface} 42%)`,
        animation: "fadeIn 180ms ease",
      }}
    >
      {stage === "stretch" && (
        <>
          <SectionTitle
            eyebrow="RECOVERY · STEP 1"
            title="Stretch first"
            copy={`${recommendation.stretchingType === "targeted" ? "Targeted mobility" : "Full-body mobility"} based on today's session.`}
            color={color}
          />
          <div style={{ display: "grid", gap: 7 }}>
            {recommendation.stretches.map((stretch) => (
              <div
                key={stretch.id}
                style={{ display: "flex", gap: 9, color: T.text, fontSize: 12 }}
              >
                <span style={{ color }}>•</span>
                <span>{stretch.label}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: "12px 0", color: T.muted, fontSize: 11 }}>
            {recommendation.stretchDuration.label} · Comfortable range only. Never force a painful
            stretch.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setStretchingCompleted(true);
                setStage("checkin");
              }}
              style={primaryButtonStyle(color)}
            >
              Stretch complete
            </button>
            <button type="button" onClick={() => setStage("checkin")} style={secondaryButtonStyle}>
              Skip
            </button>
          </div>
        </>
      )}

      {stage === "checkin" && (
        <>
          <SectionTitle
            eyebrow="BODY CHECK-IN"
            title="How does your body feel?"
            copy="Choose what fits right now. Nothing starts automatically."
            color={color}
          />
          <div style={{ display: "grid", gap: 7 }}>
            {BODY_CHECK_INS.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => chooseCheckIn(option.id)}
                style={stepButtonStyle(bodyCheckIn === option.id, color)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStage("extra")}
            style={{ ...secondaryButtonStyle, width: "100%", marginTop: 8 }}
          >
            Skip check-in
          </button>
        </>
      )}

      {stage === "offer_help" && (
        <>
          <SectionTitle
            eyebrow="OPTIONAL SUPPORT"
            title="Want to work on it now?"
            copy="A short sequence can help you check the area without turning recovery into another workout."
            color={color}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={acceptHelp} style={primaryButtonStyle(color)}>
              Yes, help me
            </button>
            <button type="button" onClick={() => setStage("extra")} style={secondaryButtonStyle}>
              Skip
            </button>
          </div>
        </>
      )}

      {stage === "region" && (
        <>
          <SectionTitle
            eyebrow="PROBLEM AREA"
            title="Where is it tight?"
            copy="Pick the closest area. This is guidance, not an injury diagnosis."
            color={color}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 7 }}
          >
            {BODY_REGIONS.map((region) => (
              <button
                type="button"
                key={region.id}
                onClick={() => {
                  setProblemArea(region.id);
                  setStage("treatment");
                }}
                style={stepButtonStyle(problemArea === region.id, color)}
              >
                {region.label}
              </button>
            ))}
          </div>
        </>
      )}

      {stage === "treatment" && (
        <>
          <SectionTitle
            eyebrow="SHORT RESET"
            title={
              problemArea
                ? `${BODY_REGIONS.find((region) => region.id === problemArea)?.label || "Area"} release`
                : "Gentle recovery reset"
            }
            copy="Move slowly and stop if symptoms feel sharp, unusual, or worse."
            color={color}
          />
          <ol
            style={{
              margin: "0 0 14px",
              paddingLeft: 20,
              color: T.text,
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            {(
              KNOT_TREATMENT_SEQUENCES[problemArea || "other"] || KNOT_TREATMENT_SEQUENCES.other
            ).map((step) => (
              <li key={step} style={{ marginBottom: 6 }}>
                {step}
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setKnotTreatmentCompleted(true);
                setStage("feedback");
              }}
              style={primaryButtonStyle(color)}
            >
              Treatment complete
            </button>
            <button type="button" onClick={() => setStage("extra")} style={secondaryButtonStyle}>
              Skip
            </button>
          </div>
        </>
      )}

      {stage === "feedback" && (
        <>
          <SectionTitle eyebrow="RE-TEST" title="How does it feel now?" color={color} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
            {["better", "same", "worse"].map((result) => (
              <button
                type="button"
                key={result}
                onClick={() => {
                  setAfterState(result);
                  setStage(result === "worse" ? "stop" : "extra");
                }}
                style={stepButtonStyle(afterState === result, result === "worse" ? T.red : color)}
              >
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}

      {stage === "stop" && (
        <>
          <SectionTitle
            eyebrow="STOP FOR NOW"
            title="Don’t add more pressure"
            copy="Stop this recovery technique for now. If pain is severe, unusual, or persistent, consider appropriate medical care."
            color={T.red}
          />
          <button
            type="button"
            onClick={() => finish()}
            style={{ ...primaryButtonStyle(color), width: "100%" }}
          >
            Complete recovery
          </button>
        </>
      )}

      {stage === "extra" && (
        <>
          <SectionTitle
            eyebrow="EXTRA RECOVERY · OPTIONAL"
            title="Want some extra recovery?"
            copy="One short add-on is enough. You can always finish here."
            color={color}
          />
          <button
            type="button"
            onClick={() => selectTool(recommendation.recommendedTool)}
            style={{ ...stepButtonStyle(true, color), padding: 14 }}
          >
            <span style={{ display: "block", fontSize: 9, letterSpacing: 1.5, marginBottom: 4 }}>
              RECOMMENDED
            </span>
            {RECOVERY_TOOL_CONFIG[recommendation.recommendedTool].emoji}{" "}
            {RECOVERY_TOOL_CONFIG[recommendation.recommendedTool].label} ·{" "}
            {RECOVERY_TOOL_CONFIG[recommendation.recommendedTool].duration}
          </button>
          <button
            type="button"
            aria-expanded={showOtherTools}
            onClick={() => setShowOtherTools((visible) => !visible)}
            style={{ ...secondaryButtonStyle, width: "100%", marginTop: 8 }}
          >
            {showOtherTools ? "Hide other tools" : "Other options"}
          </button>
          {showOtherTools && (
            <div style={{ display: "grid", gap: 7, marginTop: 8 }}>
              {recommendation.availableTools
                .filter((tool) => tool !== recommendation.recommendedTool)
                .map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => selectTool(tool)}
                    style={stepButtonStyle(false, color)}
                  >
                    {RECOVERY_TOOL_CONFIG[tool].emoji} {RECOVERY_TOOL_CONFIG[tool].label}
                  </button>
                ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => finish()}
            style={{ ...secondaryButtonStyle, width: "100%", marginTop: 8 }}
          >
            Done
          </button>
        </>
      )}

      {stage === "tool" && selectedTool && (
        <>
          <SectionTitle
            eyebrow="OPTIONAL TOOL"
            title={`${RECOVERY_TOOL_CONFIG[selectedTool].emoji} ${RECOVERY_TOOL_CONFIG[selectedTool].label}`}
            copy={`${RECOVERY_TOOL_CONFIG[selectedTool].duration} · Keep this session small and specific.`}
            color={color}
          />
          <ul style={{ margin: "0 0 12px", paddingLeft: 19, fontSize: 12, lineHeight: 1.55 }}>
            {RECOVERY_TOOL_CONFIG[selectedTool].instructions.map((instruction) => (
              <li key={instruction} style={{ marginBottom: 5 }}>
                {instruction}
              </li>
            ))}
          </ul>
          <p
            style={{
              margin: "0 0 14px",
              padding: 10,
              borderLeft: `3px solid ${color}`,
              background: `${color}0D`,
              color: T.muted,
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            {RECOVERY_TOOL_CONFIG[selectedTool].safety}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                const nextTools = [...new Set([...toolsUsed, selectedTool])];
                setToolsUsed(nextTools);
                finish(nextTools);
              }}
              style={primaryButtonStyle(color)}
            >
              Tool complete
            </button>
            <button type="button" onClick={() => finish()} style={secondaryButtonStyle}>
              Skip
            </button>
          </div>
        </>
      )}

      {stage === "complete" && (
        <>
          <SectionTitle
            eyebrow="RECOVERY COMPLETE"
            title="Nice work — keep it easy"
            copy="Your recovery choices were saved with today’s activity history."
            color={color}
          />
          <button
            type="button"
            onClick={onClose}
            style={{ ...primaryButtonStyle(color), width: "100%" }}
          >
            Close recovery
          </button>
        </>
      )}
    </section>
  );
}
