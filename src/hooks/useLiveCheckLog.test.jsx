import { useCallback, useMemo, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLiveCheckLog } from "./useLiveCheckLog.js";
import { buildLiveLogGroups, workoutGroupId } from "../data/liveLogGroups.js";
import { createActivity } from "../utils/normalizeActivityLog.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { stretchCheckKey, stretchSections } from "../data/stretches.js";
import { workoutSetKey, workoutUnitKeys, workouts } from "../data/workouts.js";
import { simpleEx } from "../data/simpleExercises.js";
import { foamTech } from "../data/foamRoller.js";
import { StretchScreen } from "../screens/StretchScreen.jsx";
import { WorkoutSetsScreen } from "../screens/WorkoutSetsScreen.jsx";
import { SimpleWorkoutsScreen } from "../screens/SimpleWorkoutsScreen.jsx";
import { FoamRollerScreen } from "../screens/FoamRollerScreen.jsx";

const allStretches = stretchSections.flatMap((section) => section.items);
const [upperBody] = stretchSections;
const firstWorkout = workouts[0];
const firstExercise = firstWorkout.steps[1];

// The latest log the harness holds, read back by the assertions.
let currentLog = [];

// A stand-in for App: an in-memory activity log, the shared checkmarks, the
// live-logging hook, and whichever screen is under test.
function Harness({ initialChecked = {}, initialLog = [], children }) {
  const [checked, setChecked] = useState(initialChecked);
  const [log, setLog] = useState(initialLog);
  currentLog = log;
  const addActivity = useCallback((entry) => {
    const activity = createActivity(entry);
    setLog((previous) => [activity, ...previous]);
    return activity;
  }, []);
  const updateActivity = useCallback(
    (id, updates) =>
      setLog((previous) =>
        previous.map((entry) =>
          entry.id === id
            ? { ...entry, ...(typeof updates === "function" ? updates(entry) : updates) }
            : entry
        )
      ),
    []
  );
  const deleteActivity = useCallback(
    (id) => setLog((previous) => previous.filter((entry) => entry.id !== id)),
    []
  );
  const groups = useMemo(() => buildLiveLogGroups(), []);
  const getLiveActivity = useLiveCheckLog({
    groups,
    checked,
    setChecked,
    log,
    addActivity,
    updateActivity,
    deleteActivity,
  });
  return children({ checked, setChecked, getLiveActivity, updateActivity, deleteActivity });
}

const today = () => new Date().toDateString();
const startedToday = () =>
  localStorage.setItem(
    STORAGE_KEYS.liveCheckLog,
    JSON.stringify({ day: today(), entries: {}, baseline: {} })
  );

const stretchScreen = (props) => (
  <StretchScreen
    onBack={() => {}}
    checked={props.checked}
    setChecked={props.setChecked}
    getLiveActivity={props.getLiveActivity}
    onUpdateActivity={props.updateActivity}
  />
);

const workoutScreen = (props) => (
  <WorkoutSetsScreen
    onBack={() => {}}
    checked={props.checked}
    setChecked={props.setChecked}
    getLiveActivity={props.getLiveActivity}
    onAddActivity={() => ({})}
    onUpdateActivity={props.updateActivity}
    customWorkouts={[]}
    onAddWorkout={() => {}}
    onUpdateWorkout={() => {}}
    onDeleteWorkout={() => {}}
  />
);

describe("live check logging", () => {
  it("logs a stretch the moment it is checked and grows the same entry", () => {
    startedToday();
    render(<Harness>{stretchScreen}</Harness>);

    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[0].name) }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({
      type: "stretch",
      name: `Partial Stretch (${upperBody.items[0].name})`,
      completed: false,
    });

    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[1].name) }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0].details.bodyAreas).toEqual([
      upperBody.items[0].name,
      upperBody.items[1].name,
    ]);
  });

  it("takes a stretch back out of the log when it is unchecked", () => {
    startedToday();
    render(<Harness>{stretchScreen}</Harness>);
    const neck = () => screen.getByRole("button", { name: new RegExp(upperBody.items[0].name) });

    fireEvent.click(neck());
    expect(currentLog).toHaveLength(1);
    fireEvent.click(neck());
    expect(currentLog).toHaveLength(0);
  });

  it("marks the entry complete and offers details when every stretch is done", () => {
    startedToday();
    const allButLast = Object.fromEntries(
      allStretches.slice(0, -1).map((item) => [stretchCheckKey(item), true])
    );
    render(<Harness initialChecked={allButLast}>{stretchScreen}</Harness>);
    expect(currentLog).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { pressed: false }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({ name: "Full Body Stretch", completed: true });
    expect(screen.getByRole("region", { name: /completion details/i })).toBeInTheDocument();
  });

  it("keeps a note added to the entry when more stretches are checked", () => {
    startedToday();
    render(<Harness>{stretchScreen}</Harness>);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[0].name) }));
    act(() => {
      // As if saved from the details form or the log screen.
      currentLog[0].note = "felt tight";
    });
    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[1].name) }));
    expect(currentLog[0].note).toBe("felt tight");
  });

  it("logs each workout set as it is ticked", () => {
    startedToday();
    render(<Harness>{workoutScreen}</Harness>);

    fireEvent.click(screen.getByRole("button", { name: `${firstExercise.phase} set 1` }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({
      type: "workout",
      name: `${firstWorkout.title} (Partial)`,
      completed: false,
      details: { workoutId: firstWorkout.id, completedSets: 1 },
    });
    expect(currentLog[0].details.exercises[0]).toEqual({
      name: firstExercise.phase,
      setCount: 1,
      plannedSets: 3,
      reps: 12,
    });

    fireEvent.click(screen.getByRole("button", { name: `${firstExercise.phase} set 2` }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0].details.exercises[0].setCount).toBe(2);
  });

  it("names the workout entry after the routine once every set is done", () => {
    startedToday();
    const keys = workoutUnitKeys(firstWorkout);
    const allButLast = Object.fromEntries(keys.slice(0, -1).map((key) => [key, true]));
    render(<Harness initialChecked={allButLast}>{workoutScreen}</Harness>);

    fireEvent.click(screen.getByRole("button", { name: /Cool-Down/i }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({ name: firstWorkout.title, completed: true });
  });

  it("logs a simple exercise checked from the list", () => {
    startedToday();
    render(
      <Harness>
        {(props) => (
          <SimpleWorkoutsScreen
            onBack={() => {}}
            onOpen={() => {}}
            checked={props.checked}
            setChecked={props.setChecked}
          />
        )}
      </Harness>
    );

    fireEvent.click(screen.getByRole("button", { name: `Mark ${simpleEx[0].name} as done` }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({ type: "exercise", name: simpleEx[0].name });

    fireEvent.click(screen.getByRole("button", { name: `Mark ${simpleEx[0].name} as done` }));
    expect(currentLog).toHaveLength(0);
  });

  it("logs a foam-roller area as soon as it is checked", () => {
    startedToday();
    render(
      <Harness>
        {(props) => (
          <FoamRollerScreen
            onBack={() => {}}
            checked={props.checked}
            setChecked={props.setChecked}
            getLiveActivity={props.getLiveActivity}
            onUpdateActivity={props.updateActivity}
          />
        )}
      </Harness>
    );

    fireEvent.click(screen.getByRole("button", { name: new RegExp(foamTech[0].area) }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0]).toMatchObject({
      type: "foam_rolling",
      name: "Foam Rolling (Partial)",
      details: { bodyAreas: [foamTech[0].area] },
    });
  });

  it("leaves an entry deleted from the log alone until the checks change", () => {
    startedToday();
    let deleteActivity;
    render(
      <Harness>
        {(props) => {
          deleteActivity = props.deleteActivity;
          return stretchScreen(props);
        }}
      </Harness>
    );
    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[0].name) }));
    act(() => deleteActivity(currentLog[0].id));
    expect(currentLog).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[1].name) }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0].details.bodyAreas).toHaveLength(2);
  });

  it("does not re-log checks that were already there before live logging", () => {
    // No live-log state yet: the old screens had already logged these.
    render(
      <Harness initialChecked={{ [stretchCheckKey(upperBody.items[0])]: true }}>
        {stretchScreen}
      </Harness>
    );
    expect(currentLog).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[1].name) }));
    expect(currentLog).toHaveLength(1);
    expect(currentLog[0].details.bodyAreas).toEqual([upperBody.items[1].name]);
  });

  it("clears every checkmark at midnight and keeps yesterday's log", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2024, 0, 1, 23, 58, 0));
    startedToday();
    render(<Harness>{stretchScreen}</Harness>);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(upperBody.items[0].name) }));
    expect(currentLog).toHaveLength(1);

    await act(async () => {
      vi.setSystemTime(new Date(2024, 0, 2, 0, 0, 2));
      await vi.advanceTimersByTimeAsync(3 * 60 * 1000);
    });
    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
    expect(currentLog).toHaveLength(1);
    vi.useRealTimers();
  });

  it("clears workout, foam and simple checks on a new day without logging them", () => {
    localStorage.setItem(
      STORAGE_KEYS.liveCheckLog,
      JSON.stringify({ day: "Mon Jan 01 2001", entries: {}, baseline: {} })
    );
    let checkedNow;
    render(
      <Harness
        initialChecked={{
          [workoutSetKey(firstWorkout.id, 1, 0)]: true,
          "foam-0": true,
          "sim-0": true,
          unrelated: true,
        }}
      >
        {(props) => {
          checkedNow = props.checked;
          return null;
        }}
      </Harness>
    );
    expect(checkedNow).toEqual({ unrelated: true });
    expect(currentLog).toHaveLength(0);
  });

  it("exposes today's entry per group", () => {
    startedToday();
    let getLive;
    render(
      <Harness>
        {(props) => {
          getLive = props.getLiveActivity;
          return workoutScreen(props);
        }}
      </Harness>
    );
    expect(getLive(workoutGroupId(firstWorkout.id))).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: `${firstExercise.phase} set 1` }));
    expect(getLive(workoutGroupId(firstWorkout.id))?.id).toBe(currentLog[0].id);
  });
});
