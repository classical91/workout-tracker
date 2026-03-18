import { useState } from "react";

const Dumbbell = ({ x, y, angle = 0, color, size = 1 }) => {
  const w = 18 * size, h = 5 * size, pad = 3 * size;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={2} fill={color} opacity={0.9}/>
      <rect x={-w/2 - pad} y={-h/2 - 2} width={pad} height={h+4} rx={2} fill={color}/>
      <rect x={w/2} y={-h/2 - 2} width={pad} height={h+4} rx={2} fill={color}/>
    </g>
  );
};

const FigureBase = ({ color, children, viewH = 140 }) => (
  <svg viewBox={`0 0 120 ${viewH}`} style={{ width: "100%", height: "100%" }}>
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.08"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="60" cy="70" r="55" fill="url(#bg)"/>
    <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {children}
    </g>
  </svg>
);

const illustrations = {
  "Bicep Curls": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="18" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="28" x2="60" y2="75"/>
      <line x1="60" y1="38" x2="40" y2="55"/>
      <line x1="40" y1="55" x2="38" y2="75"/>
      <line x1="60" y1="38" x2="80" y2="50"/>
      <line x1="80" y1="50" x2="72" y2="35"/>
      <line x1="60" y1="75" x2="48" y2="115"/>
      <line x1="60" y1="75" x2="72" y2="115"/>
      <Dumbbell x={68} y={31} angle={-40} color={color}/>
      <Dumbbell x={37} y={77} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Tricep Dips": ({ color }) => (
    <FigureBase color={color}>
      <rect x="10" y="85" width="100" height="8" rx="3" stroke={color} fill={`${color}22`}/>
      <circle cx="60" cy="30" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="40" x2="60" y2="72"/>
      <line x1="60" y1="48" x2="38" y2="72"/>
      <line x1="38" y1="72" x2="38" y2="85"/>
      <line x1="60" y1="48" x2="82" y2="72"/>
      <line x1="82" y1="72" x2="82" y2="85"/>
      <line x1="60" y1="72" x2="38" y2="85"/>
      <line x1="60" y1="72" x2="82" y2="85"/>
      <line x1="38" y1="85" x2="18" y2="90"/>
      <line x1="82" y1="85" x2="102" y2="90"/>
    </FigureBase>
  ),
  "Lunges": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="55" cy="18" r="10" stroke={color} fill="none"/>
      <line x1="55" y1="28" x2="55" y2="68"/>
      <line x1="55" y1="38" x2="38" y2="65"/>
      <line x1="55" y1="38" x2="72" y2="65"/>
      <line x1="55" y1="68" x2="40" y2="95"/>
      <line x1="40" y1="95" x2="30" y2="120"/>
      <line x1="55" y1="68" x2="75" y2="90"/>
      <line x1="75" y1="90" x2="85" y2="118"/>
      <line x1="10" y1="128" x2="110" y2="128" strokeOpacity="0.3"/>
      <Dumbbell x={37} y={67} angle={0} color={color} size={0.85}/>
      <Dumbbell x={73} y={67} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Shoulder Press": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="22" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="32" x2="60" y2="78"/>
      <line x1="60" y1="45" x2="35" y2="30"/>
      <line x1="35" y1="30" x2="30" y2="12"/>
      <line x1="60" y1="45" x2="85" y2="30"/>
      <line x1="85" y1="30" x2="90" y2="12"/>
      <line x1="60" y1="78" x2="47" y2="118"/>
      <line x1="60" y1="78" x2="73" y2="118"/>
      <line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>
      <Dumbbell x={30} y={10} angle={0} color={color} size={0.85}/>
      <Dumbbell x={90} y={10} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Bent-over Rows": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="35" cy="38" r="10" stroke={color} fill="none"/>
      <line x1="42" y1="44" x2="80" y2="62"/>
      <line x1="55" y1="52" x2="50" y2="36"/>
      <line x1="70" y1="58" x2="75" y2="42"/>
      <line x1="80" y1="62" x2="72" y2="95"/>
      <line x1="72" y1="95" x2="68" y2="120"/>
      <line x1="80" y1="62" x2="92" y2="92"/>
      <line x1="92" y1="92" x2="95" y2="120"/>
      <line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>
      <Dumbbell x={48} y={33} angle={-15} color={color} size={0.85}/>
      <Dumbbell x={77} y={39} angle={-15} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Standing Calf Raise": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="18" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="28" x2="60" y2="75"/>
      <line x1="60" y1="38" x2="40" y2="68"/>
      <line x1="60" y1="38" x2="80" y2="68"/>
      <line x1="60" y1="75" x2="48" y2="108"/>
      <line x1="60" y1="75" x2="72" y2="108"/>
      <line x1="48" y1="108" x2="42" y2="116"/>
      <line x1="72" y1="108" x2="78" y2="116"/>
      <line x1="10" y1="122" x2="110" y2="122" strokeOpacity="0.3"/>
      <Dumbbell x={39} y={70} angle={0} color={color} size={0.85}/>
      <Dumbbell x={81} y={70} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Step-ups": ({ color }) => (
    <FigureBase color={color}>
      <rect x="45" y="95" width="65" height="18" rx="3" stroke={color} fill={`${color}22`}/>
      <circle cx="72" cy="22" r="10" stroke={color} fill="none"/>
      <line x1="72" y1="32" x2="72" y2="72"/>
      <line x1="72" y1="42" x2="52" y2="65"/>
      <line x1="72" y1="42" x2="92" y2="65"/>
      <line x1="72" y1="72" x2="78" y2="95"/>
      <line x1="72" y1="72" x2="55" y2="88"/>
      <line x1="55" y1="88" x2="40" y2="113"/>
      <line x1="10" y1="118" x2="110" y2="118" strokeOpacity="0.3"/>
      <Dumbbell x={51} y={67} angle={0} color={color} size={0.85}/>
      <Dumbbell x={93} y={67} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Sit-ups": ({ color }) => (
    <FigureBase color={color}>
      <line x1="10" y1="110" x2="110" y2="110" strokeOpacity="0.3"/>
      <circle cx="38" cy="55" r="10" stroke={color} fill="none"/>
      <line x1="44" y1="62" x2="72" y2="88"/>
      <line x1="72" y1="88" x2="55" y2="110"/>
      <line x1="72" y1="88" x2="88" y2="108"/>
      <line x1="55" y1="110" x2="38" y2="108"/>
      <line x1="52" y1="68" x2="58" y2="62"/>
      <line x1="60" y1="76" x2="65" y2="70"/>
      <Dumbbell x={60} y={65} angle={0} color={color} size={0.9}/>
    </FigureBase>
  ),
  "Russian Twists": ({ color }) => (
    <FigureBase color={color}>
      <line x1="10" y1="112" x2="110" y2="112" strokeOpacity="0.3"/>
      <circle cx="45" cy="58" r="10" stroke={color} fill="none"/>
      <line x1="50" y1="66" x2="75" y2="88"/>
      <line x1="75" y1="88" x2="58" y2="108"/>
      <line x1="75" y1="88" x2="92" y2="105"/>
      <line x1="58" y1="108" x2="45" y2="105"/>
      <line x1="55" y1="72" x2="35" y2="62"/>
      <line x1="62" y1="75" x2="42" y2="65"/>
      <Dumbbell x={33} y={60} angle={30} color={color} size={0.9}/>
    </FigureBase>
  ),
  "Reverse Fly": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="32" cy="42" r="10" stroke={color} fill="none"/>
      <line x1="38" y1="50" x2="78" y2="68"/>
      <line x1="55" y1="58" x2="40" y2="38"/>
      <line x1="65" y1="63" x2="88" y2="44"/>
      <line x1="78" y1="68" x2="68" y2="100"/>
      <line x1="68" y1="100" x2="62" y2="122"/>
      <line x1="78" y1="68" x2="90" y2="98"/>
      <line x1="90" y1="98" x2="94" y2="122"/>
      <line x1="10" y1="128" x2="110" y2="128" strokeOpacity="0.3"/>
      <Dumbbell x={37} y={35} angle={-35} color={color} size={0.85}/>
      <Dumbbell x={90} y={41} angle={35} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Dumbbell Squats": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="20" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="30" x2="58" y2="72"/>
      <line x1="60" y1="42" x2="40" y2="68"/>
      <line x1="60" y1="42" x2="80" y2="68"/>
      <line x1="58" y1="72" x2="38" y2="95"/>
      <line x1="38" y1="95" x2="32" y2="120"/>
      <line x1="58" y1="72" x2="78" y2="95"/>
      <line x1="78" y1="95" x2="85" y2="120"/>
      <line x1="10" y1="126" x2="110" y2="126" strokeOpacity="0.3"/>
      <Dumbbell x={38} y={70} angle={0} color={color} size={0.85}/>
      <Dumbbell x={82} y={70} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Chest Press": ({ color }) => (
    <FigureBase color={color}>
      <rect x="20" y="85" width="80" height="10" rx="3" stroke={color} fill={`${color}22`}/>
      <circle cx="28" cy="72" r="10" stroke={color} fill="none"/>
      <line x1="36" y1="72" x2="95" y2="75"/>
      <line x1="52" y1="73" x2="45" y2="52"/>
      <line x1="75" y1="74" x2="80" y2="52"/>
      <line x1="95" y1="75" x2="95" y2="95"/>
      <line x1="95" y1="95" x2="85" y2="110"/>
      <line x1="95" y1="95" x2="105" y2="108"/>
      <Dumbbell x={43} y={48} angle={0} color={color} size={0.85}/>
      <Dumbbell x={82} y={48} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Lateral Raises": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="18" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="28" x2="60" y2="75"/>
      <line x1="60" y1="40" x2="22" y2="52"/>
      <line x1="60" y1="40" x2="98" y2="52"/>
      <line x1="60" y1="75" x2="48" y2="115"/>
      <line x1="60" y1="75" x2="72" y2="115"/>
      <line x1="10" y1="122" x2="110" y2="122" strokeOpacity="0.3"/>
      <Dumbbell x={20} y={50} angle={15} color={color} size={0.85}/>
      <Dumbbell x={100} y={50} angle={-15} color={color} size={0.85}/>
    </FigureBase>
  ),
  "Dumbbell Shrugs": ({ color }) => (
    <FigureBase color={color}>
      <circle cx="60" cy="16" r="10" stroke={color} fill="none"/>
      <line x1="60" y1="26" x2="60" y2="75"/>
      <line x1="60" y1="32" x2="35" y2="38"/>
      <line x1="60" y1="32" x2="85" y2="38"/>
      <line x1="35" y1="38" x2="32" y2="68"/>
      <line x1="85" y1="38" x2="88" y2="68"/>
      <line x1="60" y1="75" x2="48" y2="115"/>
      <line x1="60" y1="75" x2="72" y2="115"/>
      <line x1="10" y1="122" x2="110" y2="122" strokeOpacity="0.3"/>
      <Dumbbell x={31} y={70} angle={0} color={color} size={0.85}/>
      <Dumbbell x={89} y={70} angle={0} color={color} size={0.85}/>
    </FigureBase>
  ),
};

const workouts = [
  {
    id: 1, title: "Upper & Lower Dumbbell Challenge",
    color: "#FF6B35", emoji: "💪", tag: "Workout 1",
    steps: [
      { phase: "Warm-Up", reps: "5–10 min", detail: "Light cardio — jogging in place or jumping jacks", type: "warmup" },
      { phase: "Bicep Curls", reps: "3 × 12–15", detail: "Curl dumbbells up to shoulder height, squeeze at the top", type: "exercise" },
      { phase: "Tricep Dips", reps: "3 × 12–15", detail: "Lower body slowly, keep elbows close to body", type: "exercise" },
      { phase: "Lunges", reps: "3 × 12–15", detail: "Step forward, lower back knee toward floor, alternate legs", type: "exercise" },
      { phase: "Shoulder Press", reps: "3 × 12–15", detail: "Press dumbbells overhead from shoulder height", type: "exercise" },
      { phase: "Bent-over Rows", reps: "3 × 12–15", detail: "Hinge at hips, pull dumbbells to ribcage, squeeze back", type: "exercise" },
      { phase: "Cool-Down", reps: "5–10 min", detail: "Stretching to improve flexibility & prevent soreness", type: "cooldown" },
    ],
  },
  {
    id: 2, title: "Core & Lower Body Burn",
    color: "#FFD93D", emoji: "🔥", tag: "Workout 2",
    steps: [
      { phase: "Warm-Up", reps: "5–10 min", detail: "Light cardio to prepare your body for the workout", type: "warmup" },
      { phase: "Standing Calf Raise", reps: "3 × 12–15", detail: "Rise onto toes slowly, hold 1 sec, lower back down", type: "exercise" },
      { phase: "Step-ups", reps: "3 × 12–15", detail: "Step up onto a sturdy surface, alternate legs", type: "exercise" },
      { phase: "Sit-ups", reps: "3 × 12–15", detail: "Hold dumbbell at chest, engage core on the way up", type: "exercise" },
      { phase: "Russian Twists", reps: "3 × 12–15", detail: "Hold dumbbell, rotate torso side to side, feet off floor", type: "exercise" },
      { phase: "Reverse Fly", reps: "3 × 12–15", detail: "Hinge forward, raise dumbbells out to sides like wings", type: "exercise" },
      { phase: "Cool-Down", reps: "5–10 min", detail: "Stretching to relax muscles and promote recovery", type: "cooldown" },
    ],
  },
  {
    id: 3, title: "Dumbbell Total Body Tone-Up",
    color: "#C77DFF", emoji: "🧘", tag: "Workout 3",
    steps: [
      { phase: "Warm-Up", reps: "5–10 min", detail: "Light cardio to get your body warmed up", type: "warmup" },
      { phase: "Dumbbell Squats", reps: "3 × 12–15", detail: "Feet shoulder-width apart, sit back and down. Targets quads & glutes", type: "exercise" },
      { phase: "Chest Press", reps: "3 × 12–15", detail: "Lie on back, press dumbbells up from chest to full extension", type: "exercise" },
      { phase: "Lateral Raises", reps: "3 × 12–15", detail: "Raise arms out to sides to shoulder height to strengthen shoulders", type: "exercise" },
      { phase: "Dumbbell Shrugs", reps: "3 × 12–15", detail: "Lift shoulders toward ears to work trapezius muscles", type: "exercise" },
      { phase: "Cool-Down", reps: "5–10 min", detail: "Stretching to cool down body and promote recovery", type: "cooldown" },
    ],
  },
];

const typeStyle = {
  warmup: { bg: "#0F1F1A", accent: "#4ECDC4" },
  exercise: { bg: "#16161A", accent: null },
  cooldown: { bg: "#0F0F1F", accent: "#4ECDC4" },
};

export default function WorkoutTracker() {
  const [activeWorkout, setActiveWorkout] = useState(0);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState(null);

  const workout = workouts[activeWorkout];

  const toggle = (wi, si) => {
    const key = `${wi}-${si}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (si) => {
    setExpanded(prev => prev === si ? null : si);
  };

  const completedSteps = workout.steps.filter((_, si) => checked[`${activeWorkout}-${si}`]).length;
  const totalExercises = workout.steps.filter(s => s.type === "exercise").length;
  const completedExercises = workout.steps.filter((s, si) => s.type === "exercise" && checked[`${activeWorkout}-${si}`]).length;
  const pct = Math.round((completedSteps / workout.steps.length) * 100);

  const allWorkoutsDone = workouts.map((w, wi) =>
    w.steps.every((_, si) => checked[`${wi}-${si}`])
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0C", fontFamily: "'DM Sans', sans-serif", color: "#F0EDE8", paddingBottom: 60 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Bebas+Neue&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .tab { cursor: pointer; transition: all 0.2s ease; border-radius: 14px; } .tab:hover { transform: translateY(-2px); } .step-card { border-radius: 14px; transition: all 0.15s; margin-bottom: 8px; overflow: hidden; } .step-header { cursor: pointer; display: flex; gap: 14px; align-items: flex-start; padding: 14px 16px; } .step-header:hover { filter: brightness(1.2); } .check { width: 24px; height: 24px; border-radius: 7px; border: 2px solid; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; } .progress-track { height: 6px; background: #1A1A1E; border-radius: 99px; overflow: hidden; } .progress-fill { height: 100%; border-radius: 99px; transition: width 0.5s cubic-bezier(.4,0,.2,1); } .expand-btn { font-size: 10px; font-weight: 700; letter-spacing: 1px; border: none; background: transparent; cursor: pointer; transition: opacity 0.2s; } .expand-btn:hover { opacity: 0.7; } .illus-panel { padding: 0 16px 16px; display: flex; justify-content: center; }`}</style>

      <div style={{ padding: "32px 20px 16px", borderBottom: "1px solid #161618" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#444", fontWeight: 600, marginBottom: 4 }}>DUMBBELL PROGRAM</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 40, letterSpacing: 1, lineHeight: 1 }}>MY WORKOUTS</h1>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "#444", letterSpacing: 1 }}>EXERCISES DONE</p>
              <p style={{ fontFamily: "'Bebas Neue'", fontSize: 30, color: workout.color, lineHeight: 1.1 }}>
                {completedExercises}/{totalExercises}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 0", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {workouts.map((w, i) => {
            const done = allWorkoutsDone[i];
            const active = activeWorkout === i;
            return (
              <div key={i} className="tab" onClick={() => { setActiveWorkout(i); setExpanded(null); }}
                style={{ padding: "14px 10px", background: active ? `${w.color}18` : "#131315",
                  border: `2px solid ${active ? w.color : "#1A1A1E"}`, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 5 }}>{done ? "✅" : w.emoji}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: active ? w.color : "#444" }}>
                  {w.tag.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "16px 20px 0", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${workout.color}15, ${workout.color}05)`,
          border: `1px solid ${workout.color}25`, borderRadius: 18, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <div style={{ display: "inline-block", background: `${workout.color}20`, color: workout.color,
                borderRadius: 99, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                {workout.tag}
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 0.5, lineHeight: 1.2 }}>
                {workout.title}
              </h2>
            </div>
            <div style={{ fontSize: 42 }}>{workout.emoji}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: 1 }}>SESSION PROGRESS</span>
              <span style={{ fontSize: 11, color: workout.color, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%`,
                background: `linear-gradient(90deg, ${workout.color}70, ${workout.color})` }}/>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 600, marginBottom: 10 }}>YOUR SESSION</p>

        {workout.steps.map((step, si) => {
          const key = `${activeWorkout}-${si}`;
          const done = !!checked[key];
          const ts = typeStyle[step.type];
          const accentColor = ts.accent || workout.color;
          const IllusComponent = illustrations[step.phase];
          const isExpanded = expanded === si;

          return (
            <div key={si} className="step-card" style={{ background: ts.bg }}>
              <div className="step-header" onClick={() => toggle(activeWorkout, si)}>
                <div className="check" style={{
                  borderColor: accentColor, background: done ? accentColor : "transparent", marginTop: 2 }}>
                  {done && <span style={{ fontSize: 13, color: "#000", fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14,
                      color: done ? "#444" : "#F0EDE8", textDecoration: done ? "line-through" : "none" }}>
                      {step.phase}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: accentColor,
                      background: `${accentColor}18`, borderRadius: 99, padding: "3px 9px", whiteSpace: "nowrap" }}>
                      {step.reps}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: done ? "#333" : "#666", lineHeight: 1.5, marginBottom: IllusComponent ? 6 : 0 }}>
                    {step.detail}
                  </p>
                  {IllusComponent && (
                    <button className="expand-btn"
                      style={{ color: accentColor, paddingTop: 2 }}
                      onClick={e => { e.stopPropagation(); toggleExpand(si); }}>
                      {isExpanded ? "▲ HIDE FORM" : "▼ SHOW FORM"}
                    </button>
                  )}
                </div>
              </div>

              {IllusComponent && isExpanded && (
                <div className="illus-panel">
                  <div style={{ width: 180, height: 210,
                    background: `${accentColor}08`, borderRadius: 16,
                    border: `1px solid ${accentColor}20`, padding: 8 }}>
                    <IllusComponent color={accentColor}/>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pct === 100 && (
          <div style={{ marginTop: 16, background: `${workout.color}15`,
            border: `1px solid ${workout.color}40`, borderRadius: 14, padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🎉</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: workout.color, letterSpacing: 1 }}>WORKOUT COMPLETE!</p>
            <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Great work. Rest and recover well.</p>
          </div>
        )}

        <div style={{ marginTop: 16, background: "#131315", borderRadius: 14,
          padding: "14px 16px", border: "1px solid #1A1A1E" }}>
          <p style={{ fontSize: 10, letterSpacing: 2, color: "#444", fontWeight: 600, marginBottom: 10 }}>ALWAYS REMEMBER</p>
          {["Ankle mobility warm-up", "Neck rolls before & after", "Breathing cooldown"].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < arr.length - 1 ? 8 : 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: workout.color, flexShrink: 0 }}/>
              <span style={{ fontSize: 12, color: "#666" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
