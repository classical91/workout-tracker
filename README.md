# Wellness Tracker (React + Vite)

## Overview

Wellness Tracker is a single-page wellness app built with React. It provides guided workout/checklist screens, timers, breathing patterns, recovery guides (foam rolling + trigger points), and an activity log persisted in browser `localStorage`. The React app is bundled with Vite into a static `dist/`, which is served by a tiny zero-dependency Node server (`server/index.js`). That server also exposes an optional "sync by code" API so the activity log can be shared across a user's devices; without a sync code the app is fully local and works offline.

## Project Type

- **Type:** Frontend SPA / static site
- **Build system:** Vite
- **Runtime model in active scripts:** static `dist/` plus a small sync API, served by `node server/index.js`
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
- Workout Sets flow with three predefined dumbbell routines and per-step completion state, plus user-created custom routines (build via the "New" tab, run through the same checklist, edit or delete when done). The builder supports reordering exercises with up/down controls, and deleting a routine asks for confirmation first. Custom routines persist in `localStorage` (`wellness_custom_workouts`) and checklist progress is keyed by a stable workout id so adding, editing, or deleting one routine never shifts another's saved progress. Editing a routine clears its own checklist progress, since its steps may have changed.
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
  - `wellness_sync_code`
- A non-blocking warning banner if `localStorage` writes fail (storage full, disabled, or private browsing), so progress is never lost silently.
- **Cross-device sync (optional):** the activity log is local by default, but you can connect a device to a shared **sync code** (Activity Log → “Sync across devices”). Enter the same code on your phone and desktop and the log stays in sync through a lightweight server API (`/api/sync/:code`). There are no accounts — the code is the shared key, so pick something only you would guess. Merges are conflict-safe (newest edit per entry wins) and deletions propagate via tombstones, so nothing is silently overwritten or resurrected. See `src/hooks/useCloudSync.js`, `src/utils/mergeActivityLog.js`, and `server/index.js`.
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
- `DATA_DIR` (optional) — directory where synced logs are stored as one JSON file
  per code (default `./data`, set to `/app/data` in the Docker image). Point this
  at a persistent volume in production so synced logs survive redeploys.

Use placeholders in deployment systems as needed, for example:

- `PORT=<YOUR_PORT>`

## Deployment Notes

- `railway.json` points Railway to build using the repository `Dockerfile`.
- `Dockerfile` is a multi-stage build: it runs `npm ci && npm run build` inside the
  container, then copies the freshly generated `dist/`, the `server/` code, and the
  shared merge util into a minimal runtime image started with `node server/index.js`.
  It does **not** depend on a prebuilt `dist/` from the repo.
- `nixpacks.toml` defines a start command of `node server/index.js`. Railway uses
  the Dockerfile, so this only matters if you switch builders.
- The canonical path is: **Vite build → static `dist/` + sync API → `node server/index.js`**.
- **Persistent sync storage:** synced logs are written under `DATA_DIR`. On a
  platform with an ephemeral filesystem (e.g. Railway without a volume) they survive
  while the container is alive but reset on redeploy. To keep synced logs across
  deploys, attach a persistent volume and mount it at `DATA_DIR` (`/app/data` in the
  image). Local-only use (no sync code) needs no volume.

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
- Avoid claiming backend/API functionality; this is a static frontend with no server.

## Known Limitations / TODOs visible in code

- App data and progress live only in browser storage; no account sync or backend persistence.
- The app no longer hotlinks third-party exercise images. Workout exercises and stretches link out to a Google image search, and trigger points link to their instructional YouTube videos, so nothing breaks if a remote host changes. There are no bundled image assets to keep in sync.
- `dist/` is committed so the `nixpacks` start command can serve it without a build step; remember to rebuild and commit `dist/` after changing source if you rely on that path. (The Dockerfile/Railway path rebuilds automatically.)
