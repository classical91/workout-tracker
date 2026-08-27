# Wellness Tracker (React + Vite)

## Overview

Wellness Tracker is a single-page wellness app built with React. It provides guided workout/checklist screens, timers, breathing patterns, recovery guides (foam rolling + trigger points), and an activity log persisted in browser `localStorage`. The React app is bundled with Vite into a static `dist/`, which is served by a small Node server (`server/index.js`). That server also exposes an optional "sync by code" API so the activity log, the sets/reps plans, and custom routines can be shared across a user's devices — backed by Postgres when `DATABASE_URL` is set, and by JSON files otherwise. Without a sync code the app is fully local and works offline.

## Project Type

- **Type:** Frontend SPA / static site
- **Build system:** Vite
- **Runtime model in active scripts:** static `dist/` plus a small sync API, served by `node server/index.js` (Postgres-backed when `DATABASE_URL` is set)
- **Repository shape:** single-package repo (not a monorepo)

## Current Features (from code)

- Home dashboard with cards for:
  - Workout Sets
  - Stretch
  - Simple Workouts
  - Breathing
  - Bike timer
  - Sauna timer
  - Ohming timer
  - Foam Roller
  - Trigger Points
  - Progress (stats)
  - Exercise Log
- Workout Sets flow with three predefined dumbbell routines and user-created custom routines (build via the "New" tab, run through the same checklist, edit or delete when done). The builder supports reordering exercises with up/down controls, and deleting a routine asks for confirmation first. Custom routines persist in `localStorage` (`wellness_custom_workouts`) and checklist progress is keyed by a stable workout id so adding, editing, or deleting one routine never shifts another's saved progress. Editing a routine clears its own checklist progress and its saved plans, since its steps may have changed.
- **Sets and reps are planned up front, then ticked off set by set.** Every exercise carries a plan — how many sets you intend to do and how many reps per set — shown on the step as `3 × 12`. The exercise is not one checkbox: it renders one check per planned set, so three sets means three taps, each confirming a set you just finished. Adding an exercise in the builder asks for exactly two numbers (sets, reps per set), and the same numbers can be adjusted on any exercise — built-in routines included — from the "✎ SETS & REPS" control on its card. Shrinking the set count drops the checkmarks of the sets that no longer exist. Plans live in `localStorage` (`wellness_workout_plans`), keyed by workout id + step index, and sync across devices. See `src/data/workouts.js` (plan model), `src/components/ExerciseSets.jsx`, and `src/hooks/useWorkoutPlans.js`.
- Session logging is set-aware: progress is counted in sets, a partially finished exercise logs the sets actually completed, and each logged exercise carries its sets and planned reps, so the log fills itself in instead of asking you to re-type what you just did.
- Stretch checklist grouped by body regions.
- Simple bodyweight workouts checklist.
- Foam roller technique checklist with tips.
- Trigger point reference/checklist by body area.
- Generic countdown timer screen used by Bike, Sauna, and Ohming flows.
- Breathing screen with multiple breathing patterns.
- Exercise log view with "Reset Today" (removes only today's entries) and "Clear Log" (removes all) actions. Every completed session is kept, including multiple sessions of the same activity on the same day.
- Per-session notes: each logged session can have a free-text note (reps, weight, how it felt), edited inline in the log and persisted with the entry.
- Progress screen derived from the log: current streak, best streak, sessions this week, total sessions, total minutes, and a per-activity breakdown. Stat calculations live in `src/utils/stats.js`.
- Persistent state via `localStorage` keys (centralized in `src/constants/storageKeys.js`):
  - `wellness_checked`
  - `wellness_log`
  - `wellness_custom_workouts`
  - `wellness_workout_plans`
  - `wellness_sync_code`
- A non-blocking warning banner if `localStorage` writes fail (storage full, disabled, or private browsing), so progress is never lost silently.
- **Cross-device sync (optional):** your data is local by default, but you can connect a device to a shared **sync code** (Activity Log → “Sync across devices”). Enter the same code on your phone and desktop and three things stay in sync through the server API (`/api/sync/:code`): the activity log, the sets/reps plans, and your custom routines. There are no accounts — the code is the shared key, so pick something only you would guess (the server stores only its SHA-256 hash). The log merges entry by entry (newest edit wins) with deletions propagating via tombstones; plans and custom routines are whole documents, so the most recently edited copy wins. Nothing is silently overwritten or resurrected. See `src/hooks/useCloudSync.js`, `src/hooks/useSyncedDoc.js`, `src/utils/mergeActivityLog.js`, `src/utils/mergeSyncDocs.js`, `server/store.js`, and `server/index.js`.
- External “Go to Diet Plan” link on the home screen.

## Tech Stack

- **Frontend:** React 18, ReactDOM 18
- **Bundler/dev server:** Vite 5 + `@vitejs/plugin-react`
- **Production static server (scripts):** `serve`
- **Deployment configs:** Dockerfile, Railway config, Nixpacks config

## Installation

```bash
npm install
```

If your environment blocks npm registry access, dependency installation/build will fail until registry/network policy is resolved.

## Run Locally (Development)

```bash
npm run dev
```

Then open the local URL printed by Vite (commonly `http://localhost:5173`).

## Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Production Start

The production server serves the prebuilt `dist/` and the sync API:

```bash
npm run start
```

This runs `node server/index.js`, which serves `dist/` on `${PORT:-3000}` and
handles `/api/sync/:code`. Run `npm run build` first if `dist/` is stale.

In local development, run the Vite dev server (`npm run dev`) and, in a second
terminal, `npm run serve` for the sync API. Vite proxies `/api` to the server on
port 3000 (see `vite.config.js`), so cross-device sync works end to end locally.

## Environment Variables

No required app-specific environment variables are read by frontend code.

For hosting/runtime, these may be relevant:

- `PORT` (optional) — port the server listens on (default `3000`).
- `DATABASE_URL` (optional, recommended in production) — Postgres connection
  string. When set, synced data is stored in Postgres (table `wellness_sync`,
  created on first use; see `migrations/001_create_wellness_sync.sql`) and
  survives redeploys with no volume to manage. TLS is enabled automatically for
  anything that isn't a localhost URL. If the database can't be reached at
  startup the server logs a warning and falls back to file storage rather than
  refusing to boot.
- `DATA_DIR` (optional) — used only when `DATABASE_URL` is unset: directory where
  synced data is stored as one JSON file per code (default `./data`, set to
  `/app/data` in the Docker image). Point this at a persistent volume if you run
  without Postgres, otherwise a redeploy wipes it.
- `PGPOOL_MAX` (optional) — Postgres pool size (default `5`).

Use placeholders in deployment systems as needed, for example:

- `PORT=<YOUR_PORT>`

## Deployment Notes

- `railway.json` points Railway to build using the repository `Dockerfile`.
- `Dockerfile` is a multi-stage build: it runs `npm ci && npm run build` inside the
  container, then installs production dependencies (`pg`) and copies the freshly
  generated `dist/`, the `server/` code, and the shared merge utils into a minimal
  runtime image started with `node server/index.js`. It does **not** depend on a
  prebuilt `dist/` from the repo.
- `nixpacks.toml` defines a start command of `node server/index.js`. Railway uses
  the Dockerfile, so this only matters if you switch builders.
- The canonical path is: **Vite build → static `dist/` + sync API → `node server/index.js`**.
- **Persistent sync storage:** set `DATABASE_URL` (Railway → add a Postgres
  database; it injects the variable) and synced data lives in Postgres, surviving
  redeploys with nothing to mount. Without it the server falls back to JSON files
  under `DATA_DIR`, which on a platform with an ephemeral filesystem survive while
  the container is alive but reset on redeploy — attach a volume mounted at
  `DATA_DIR` (`/app/data` in the image) if you go that route. Local-only use (no
  sync code) needs neither.

## Folder Structure

```text
.
├─ src/
│  ├─ App.jsx          # Root component: screen routing + shared state wiring
│  ├─ main.jsx         # React entry point
│  ├─ theme.js         # Shared colors/fonts
│  ├─ screens/         # One component per screen (Home, Stretch, Timer, Log, …)
│  ├─ components/      # Reusable UI (cards, headers, banners, timer circle, …)
│  ├─ hooks/           # useLocalStorage, useWorkoutLog, useCustomWorkouts
│  ├─ constants/       # storageKeys.js (centralized localStorage keys)
│  ├─ utils/           # stats.js (streaks/weekly/totals derived from the log)
│  └─ data/            # Workout/stretch/recovery datasets + illustration maps
├─ dist/               # Built static assets (generated; committed for nixpacks)
├─ index.html          # Vite HTML entry for development/build
├─ package.json        # Scripts + dependencies
├─ vite.config.js      # Vite config
├─ Dockerfile          # Multi-stage build (npm ci + build) → serve dist/
├─ railway.json        # Railway Dockerfile build config
├─ nixpacks.toml       # Nixpacks start command
└─ REPOSITORY_REVIEW.md
```

## Important Files

- `src/App.jsx`: Root component. Holds screen state, wires shared `checked`/`log` state into screens via the `screen` switch, and renders the storage-warning banner.
- `src/hooks/useLocalStorage.js`: Persists state to `localStorage` and reports a save error.
- `src/hooks/useWorkoutLog.js`: Owns the activity log (add/clear) backed by `useLocalStorage`.
- `src/main.jsx`: Mounts the React app.
- `package.json`: Source of truth for local dev/build/start commands.
- `Dockerfile`: Multi-stage image that builds in-container, then serves `dist/`.

## Developer Notes (for Codex / Claude / OpenClaw agents)

- Verify behavior from `package.json` scripts first; they define the active runtime path.
- Screens live in `src/screens/`, reusable UI in `src/components/`, and datasets in `src/data/`. `src/App.jsx` only routes between screens and owns shared state.
- If adding documentation for features, confirm they are represented in:
  1. `activities` list (`src/data/activities.js`)
  2. corresponding screen component in `src/screens/`
  3. screen switch logic in `App.jsx`
- If changing deploy docs, cross-check `Dockerfile`, `railway.json`, and `nixpacks.toml` together.
- The sync API is the one piece of backend: keep `src/utils/mergeActivityLog.js` and
  `src/utils/mergeSyncDocs.js` import-free so the browser and the server keep
  resolving conflicts identically, and add any new file they need to the runtime
  stage of the `Dockerfile`.

## Known Limitations / TODOs visible in code

- App data and progress live in browser storage by default. There are still no
  accounts: cross-device persistence is opt-in per device via a shared sync code,
  and anyone who knows the code can read and write that code's data.
- The app no longer hotlinks third-party exercise images. Workout exercises and stretches link out to a Google image search, and trigger points link to their instructional YouTube videos, so nothing breaks if a remote host changes. There are no bundled image assets to keep in sync.
- `dist/` is committed so the `nixpacks` start command can serve it without a build step; remember to rebuild and commit `dist/` after changing source if you rely on that path. (The Dockerfile/Railway path rebuilds automatically.)
