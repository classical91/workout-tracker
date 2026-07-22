import { describe, expect, it } from "vitest";
import { stretchCheckKey, stretchSections, summarizeStretchSession } from "./stretches.js";

const [upperBody, core] = stretchSections;
const allItems = stretchSections.flatMap((section) => section.items);

const checkItems = (items) =>
  Object.fromEntries(items.map((item) => [stretchCheckKey(item), true]));

describe("summarizeStretchSession", () => {
  it("names a finished routine as a full body stretch", () => {
    const summary = summarizeStretchSession(checkItems(allItems));
    expect(summary.fullBody).toBe(true);
    expect(summary.name).toBe("Full Body Stretch");
    expect(summary.doneCount).toBe(allItems.length);
    expect(summary.completedSections).toEqual(stretchSections.map((s) => s.label));
  });

  it("names a completed region after that region", () => {
    const summary = summarizeStretchSession(checkItems(upperBody.items));
    expect(summary.fullBody).toBe(false);
    expect(summary.name).toBe("Upper Body Stretch");
    expect(summary.completedSections).toEqual(["Upper Body"]);
    expect(summary.doneItems.map((item) => item.name)).toEqual(
      upperBody.items.map((item) => item.name)
    );
  });

  it("notes extra areas stretched beyond a completed region", () => {
    const summary = summarizeStretchSession(checkItems([...upperBody.items, core.items[0]]));
    expect(summary.name).toBe("Upper Body Stretch + 1 area");
    expect(summary.completedSections).toEqual(["Upper Body"]);
    expect(summary.doneCount).toBe(upperBody.items.length + 1);
  });

  it("labels a session with no completed region as partial", () => {
    const summary = summarizeStretchSession(checkItems(upperBody.items.slice(0, 2)));
    expect(summary.fullBody).toBe(false);
    expect(summary.completedSections).toEqual([]);
    expect(summary.name).toBe("Partial Stretch (2 areas)");
  });

  it("records each stretched part with its planned hold", () => {
    const summary = summarizeStretchSession(checkItems([upperBody.items[0]]));
    expect(summary.name).toBe("Partial Stretch (1 area)");
    expect(summary.doneItems[0]).toMatchObject({
      name: upperBody.items[0].name,
      hold: upperBody.items[0].hold,
    });
  });
});
