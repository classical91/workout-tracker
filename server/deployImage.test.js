// @vitest-environment node
//
// The runtime image is built from a short list of files, not the whole repo:
// the Dockerfile copies `server/` plus a few named files out of `src/`. That
// list is easy to forget, and forgetting it is not a broken route — the server
// fails to resolve the import at boot and the whole service is down, the app
// included, since this same process serves `dist/`.
//
// So the list is checked rather than remembered: walk what the server actually
// imports out of `src/`, transitively, and fail when one of those files is not
// copied into the image.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SERVER_DIR = path.join(ROOT, "server");

const IMPORT_PATTERN = /(?:import|export)[^"']*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

/** Every relative specifier a module imports, in source order. */
function relativeImports(source) {
  const found = [];
  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const specifier = match[1] || match[2];
    if (specifier && specifier.startsWith(".")) found.push(specifier);
  }
  return found;
}

/**
 * Every file under src/ the server reaches, following imports through src/ as
 * well — weeklyPlanDay.js pulls in weeklyPlan.js, and the image needs both.
 * Test files are skipped: they are not part of the running server.
 */
async function serverSourceDependencies() {
  const entries = (await fs.readdir(SERVER_DIR))
    .filter((name) => name.endsWith(".js") && !name.includes(".test."))
    .map((name) => path.join(SERVER_DIR, name));

  const seen = new Set();
  const needed = new Set();
  const queue = [...entries];

  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);

    const source = await fs.readFile(file, "utf8");
    for (const specifier of relativeImports(source)) {
      const resolved = path.resolve(path.dirname(file), specifier);
      const relative = path.relative(ROOT, resolved);
      if (relative.startsWith("src" + path.sep)) needed.add(relative);
      queue.push(resolved);
    }
  }

  return [...needed].sort();
}

describe("the runtime image", () => {
  it("carries every src/ file the server imports", async () => {
    const dockerfile = await fs.readFile(path.join(ROOT, "Dockerfile"), "utf8");
    const needed = await serverSourceDependencies();

    // Sanity: the walk found something, so a broken matcher cannot pass this
    // test by finding nothing to check.
    expect(needed.length).toBeGreaterThan(0);

    const missing = needed.filter((file) => !dockerfile.includes(`COPY ${file.split(path.sep).join("/")} `));
    expect(
      missing,
      `Add a COPY line to the Dockerfile for each of these, or the server will not boot: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
