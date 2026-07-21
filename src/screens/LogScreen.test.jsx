import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LogScreen } from "./LogScreen.jsx";
import { normalizeActivityLog } from "../utils/normalizeActivityLog.js";

const entries = normalizeActivityLog([
  { ts: 1710000000000, name: "Legacy Workout", emoji: "💪", duration: "30 min" },
  {
    id: "sauna-1",
    ts: 1710000100000,
    type: "sauna",
    category: "heat",
    name: "Sauna",
    emoji: "🧖",
    color: "#E74C3C",
    duration: "45 min",
    details: { rounds: 3, temperature: 80, temperatureUnit: "C" },
  },
]);

const renderLog = (props = {}) =>
  render(
    <LogScreen
      onBack={() => {}}
      log={entries}
      onClear={() => {}}
      onClearToday={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
      {...props}
    />
  );

describe("Activity Log", () => {
  it("shows legacy and structured entries and filters by category", () => {
    renderLog();
    expect(screen.getByText("Legacy Workout")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Sauna/i }));
    expect(screen.getByText("3 rounds")).toBeInTheDocument();
    expect(screen.getByText("80°C")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Heat" }));
    expect(screen.queryByText("Legacy Workout")).not.toBeInTheDocument();
    expect(screen.getByText("Sauna")).toBeInTheDocument();
  });

  it("edits a note and deletes one entry", () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    renderLog({ onUpdate, onDelete });
    fireEvent.click(screen.getByRole("button", { name: /Sauna/i }));
    fireEvent.click(screen.getByRole("button", { name: "Edit entry" }));
    fireEvent.change(screen.getByLabelText("Note"), { target: { value: " Relaxed " } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onUpdate).toHaveBeenCalledWith("sauna-1", expect.objectContaining({ note: "Relaxed" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Delete" }).at(-1));
    expect(onDelete).toHaveBeenCalledWith("sauna-1");
  });

  it("handles an empty log", () => {
    renderLog({ log: [] });
    expect(screen.getByText(/No activities yet/i)).toBeInTheDocument();
  });
});
