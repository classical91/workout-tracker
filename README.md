# Workout Tracker (React + Vite)

## Overview

Workout Tracker is a single-page wellness app built with React. It provides guided workout/checklist screens, timers, breathing patterns, recovery guides (foam rolling + trigger points), and an activity log persisted in browser `localStorage`. The app is a frontend-only static site: the source is bundled with Vite and the resulting `dist/` is served by a static file server. There is no backend.

## Project Type

- **Type:** Frontend SPA / static site
- **Build system:** Vite
- **Runtime model in active scripts:** static file serving from `dist/` using `serve`
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
- Workout Sets flow with three predefined dumbbell routines and per-step completion state, plus user-created custom routines (build via the "New" tab, run through the same checklist, delete when done). Custom routines persist in `localStorage` (`wellness_custom_workouts`) and checklist progress is keyed by a stable workout id so deleting one routine never shifts another's saved progress.
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
- A non-blocking warning banner if `localStorage` writes fail (storage full, disabled, or private browsing), so progress is never lost silently.
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

This repo currently supports static production serving from prebuilt assets:

```bash
npm run start
```

By default this runs:

- `serve dist -l ${PORT:-3000}`

This serves the prebuilt `dist/` output. Run `npm run build` first if `dist/` is stale.

## Environment Variables

No required app-specific environment variables are read by frontend code.

For hosting/runtime, these may be relevant:

- `PORT` (optional) — port used by static server command.

Use placeholders in deployment systems as needed, for example:

- `PORT=<YOUR_PORT>`

## Deployment Notes

- `railway.json` points Railway to build using the repository `Dockerfile`.
- `Dockerfile` is a multi-stage build: it runs `npm ci && npm run build` inside the
  container, then copies the freshly generated `dist/` into a minimal runtime image
  served by `serve`. It does **not** depend on a prebuilt `dist/` from the repo.
- `nixpacks.toml` defines a start command with `npx serve dist -l $PORT` (note:
  unlike the Dockerfile, this path does **not** build, so it relies on a committed
  `dist/`). Railway uses the Dockerfile, so this only matters if you switch builders.
- The canonical path is: **Vite build → static `dist/` → `serve`**. There is no
  backend server; keep deploy configs aligned with this single static-site model.

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
