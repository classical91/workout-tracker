import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useActivityLog } from "./hooks/useActivityLog.js";
import { useCustomWorkouts } from "./hooks/useCustomWorkouts.js";
import { STORAGE_KEYS } from "./constants/storageKeys.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "./constants/activityTypes.js";
import { StorageWarning } from "./components/StorageWarning.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { WorkoutSetsScreen } from "./screens/WorkoutSetsScreen.jsx";
import { StretchScreen } from "./screens/StretchScreen.jsx";
import { SimpleWorkoutsScreen } from "./screens/SimpleWorkoutsScreen.jsx";
import { BreathingScreen } from "./screens/BreathingScreen.jsx";
import { FoamRollerScreen } from "./screens/FoamRollerScreen.jsx";
import { TriggerPointsScreen } from "./screens/TriggerPointsScreen.jsx";
import { ReflexologyScreen } from "./screens/ReflexologyScreen.jsx";
import { LogScreen } from "./screens/LogScreen.jsx";
import { TimerScreen } from "./screens/TimerScreen.jsx";
import { BenefitsScreen } from "./screens/BenefitsScreen.jsx";
import { CalmScreen } from "./screens/CalmScreen.jsx";
import { CalmingFoodsScreen } from "./screens/CalmingFoodsScreen.jsx";
import { SimpleExerciseScreen } from "./screens/SimpleExerciseScreen.jsx";
import { WeeklyPlanScreen } from "./screens/WeeklyPlanScreen.jsx";
import { ExcusesScreen } from "./screens/ExcusesScreen.jsx";
import { SaunaScreen } from "./screens/SaunaScreen.jsx";

function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts.length === 0) return { screen: "home", param: null };
  if (parts[0] === "simple" && parts[1]) return { screen: "simple-exercise", param: parts[1] };
  return { screen: parts[0], param: null };
}

function toHash(screen, param) {
  if (!screen || screen === "home") return "#/";
  if (screen === "simple-exercise") return param ? `#/simple/${param}` : "#/simple";
  return `#/${screen}`;
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [timerActivity, setTimerActivity] = useState(null);
  const { screen, param } = route;

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next, nextParam) => {
    const target = toHash(next, nextParam);
    if (window.location.hash === target) setRoute(parseHash());
    else window.location.hash = target;
  };
  const setScreen = (next) => navigate(next);

  const [checked, setChecked, checkedSaveError] = useLocalStorage(STORAGE_KEYS.checked, {});
  const {
    log,
    addActivity,
    updateActivity,
    deleteActivity,
    clearLog,
    clearToday,
    saveError: logSaveError,
    sync,
  } = useActivityLog();
  const {
    customWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    saveError: customSaveError,
  } = useCustomWorkouts();

  const goHome = () => setScreen("home");
  const goCalm = () => setScreen("calm");
  const timerDone = (activity) =>
    addActivity({
      ...activity,
      completed: true,
      details: { completedTimer: true, ...(activity.details || {}) },
    });

  const startQuickTimer = (activity) => {
    if (activity.type === ACTIVITY_TYPES.SAUNA) {
      setScreen("sauna");
      return;
    }
    setTimerActivity(activity);
    setScreen("quick-timer");
  };

  const renderScreen = () => {
    switch (screen) {
      case "workout-sets":
        return (
          <WorkoutSetsScreen
            onBack={goHome}
            checked={checked}
            setChecked={setChecked}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            customWorkouts={customWorkouts}
            onAddWorkout={addWorkout}
            onUpdateWorkout={updateWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        );
      case "weekly-plan":
        return <WeeklyPlanScreen onBack={goHome} onNavigate={setScreen} />;
      case "excuses":
        return <ExcusesScreen onBack={goHome} onNavigate={setScreen} />;
      case "stretch":
        return (
          <StretchScreen
            onBack={goHome}
            checked={checked}
            setChecked={setChecked}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "simple":
        return (
          <SimpleWorkoutsScreen
            onBack={goHome}
            onOpen={(slug) => navigate("simple-exercise", slug)}
            checked={checked}
            setChecked={setChecked}
          />
        );
      case "simple-exercise":
        return (
          <SimpleExerciseScreen
            slug={param}
            onBack={() => navigate("simple")}
            onOpen={(slug) => navigate("simple-exercise", slug)}
            checked={checked}
            setChecked={setChecked}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "calm":
        return <CalmScreen onBack={goHome} onNavigate={setScreen} />;
      case "breathing":
        return (
          <BreathingScreen
            onBack={goCalm}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "sauna":
        return <SaunaScreen onBack={goHome} onAddActivity={addActivity} />;
      case "calming-foods":
        return <CalmingFoodsScreen onBack={goCalm} />;
      case "cold-shower":
        return (
          <TimerScreen
            title="Cold Shower"
            subtitle="RESET · 2 MIN"
            emoji="🚿"
            color="#378ADD"
            defaultMins={2}
            onBack={goCalm}
            onUpdateActivity={updateActivity}
            onComplete={() =>
              timerDone({
                type: ACTIVITY_TYPES.COLD_SHOWER,
                category: ACTIVITY_CATEGORIES.COLD,
                name: "Cold Shower",
                emoji: "🚿",
                color: "#378ADD",
                duration: "2 min",
              })
            }
            note="Start warm, then turn cold for the timer. Breathe slowly through the shock — long exhales. Step out if you feel unwell."
          />
        );
      case "body-scan":
        return (
          <TimerScreen
            title="Body Scan"
            subtitle="WIND-DOWN · 10 MIN"
            emoji="🛌"
            color="#2ECC71"
            defaultMins={10}
            onBack={goCalm}
            onUpdateActivity={updateActivity}
            onComplete={() =>
              timerDone({
                type: ACTIVITY_TYPES.BODY_SCAN,
                category: ACTIVITY_CATEGORIES.MINDFULNESS,
                name: "Body Scan",
                emoji: "🛌",
                color: "#2ECC71",
                duration: "10 min",
                details: { technique: "Body Scan" },
              })
            }
            note="Lie down and move attention slowly from your toes to your face. Notice tension and soften it on the exhale."
          />
        );
      case "foam-roller":
        return (
          <FoamRollerScreen
            onBack={goHome}
            checked={checked}
            setChecked={setChecked}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "trigger-points":
        return (
          <TriggerPointsScreen
            onBack={goHome}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "reflexology":
        return (
          <ReflexologyScreen
            onBack={goHome}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
          />
        );
      case "log":
        return (
          <LogScreen
            onBack={goHome}
            log={log}
            sync={sync}
            onClear={clearLog}
            onClearToday={clearToday}
            onUpdate={updateActivity}
            onDelete={deleteActivity}
          />
        );
      case "benefits":
        return <BenefitsScreen onBack={goHome} />;
      case "ohming":
        return (
          <TimerScreen
            title="Ohming"
            subtitle="MEDITATION · 5 MIN"
            emoji="🕉️"
            color="#C77DFF"
            defaultMins={5}
            onBack={goCalm}
            onUpdateActivity={updateActivity}
            onComplete={() =>
              timerDone({
                type: ACTIVITY_TYPES.OHMING,
                category: ACTIVITY_CATEGORIES.BREATHING,
                name: "Ohming",
                emoji: "🕉️",
                color: "#C77DFF",
                duration: "5 min",
                details: { technique: "Ohming" },
              })
            }
            note="Sit comfortably. Inhale deeply, then exhale with a low Ohhhmm sound."
          />
        );
      case "quick-timer":
        if (!timerActivity)
          return <HomeScreen onNavigate={setScreen} onStartTimer={startQuickTimer} />;
        return (
          <TimerScreen
            title={timerActivity.name}
            subtitle={`${timerActivity.name.toUpperCase()} · ${timerActivity.duration.toUpperCase()}`}
            emoji={timerActivity.emoji}
            color={timerActivity.color}
            defaultMins={parseInt(timerActivity.duration, 10) || 20}
            onBack={goHome}
            onUpdateActivity={updateActivity}
            onComplete={() => timerDone(timerActivity)}
          />
        );
      case "home":
      default:
        return <HomeScreen onNavigate={setScreen} onStartTimer={startQuickTimer} />;
    }
  };

  return (
    <>
      {renderScreen()}
      {(checkedSaveError || logSaveError || customSaveError) && <StorageWarning />}
    </>
  );
}
