import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // The server tests run in the node environment, where there is no DOM
  // storage to reset.
  if (typeof localStorage !== "undefined") localStorage.clear();
});
