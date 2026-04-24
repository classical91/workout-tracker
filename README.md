# Workout Tracker (React + Vite)

## Overview
Workout Tracker is a single-page wellness app built with React. It provides guided workout/checklist screens, timers, breathing patterns, recovery guides (foam rolling + trigger points), and an activity log persisted in browser `localStorage`. The app is currently structured as a frontend-first project, with static hosting as the active runtime path and an unused Express server file still present in the repository.

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
  - Exercise Log
- Workout Sets flow with three predefined dumbbell routines and per-step completion state.
- Stretch checklist grouped by body regions.
- Simple bodyweight workouts checklist.
- Foam roller technique checklist with tips.
- Trigger point reference/checklist by body area.
- Generic countdown timer screen used by Bike, Sauna, and Ohming flows.
- Breathing screen with multiple breathing patterns.
- Exercise log view and clear-log action.
- Persistent state via `localStorage` keys:
  - `wellness_checked`
  - `wellness_log`
- External “Go to Diet Plan” link on the home screen.

## Tech Stack
- **Frontend:** React 18, ReactDOM 18
- **Bundler/dev server:** Vite 5 + `@vitejs/plugin-react`
- **Production static server (scripts):** `serve`
- **Optional/legacy file present:** Express server (`server.js`)
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

> Note: `server.js` exists, but it is not used by the current npm scripts.

## Environment Variables
No required app-specific environment variables are read by frontend code.

For hosting/runtime, these may be relevant:
- `PORT` (optional) — port used by static server command.

Use placeholders in deployment systems as needed, for example:
- `PORT=<YOUR_PORT>`

## Deployment Notes
- `railway.json` points Railway to build using the repository `Dockerfile`.
- `Dockerfile` serves prebuilt `dist/` (it does **not** run a build stage).
  - Ensure `dist/` is freshly built before image build/deploy.
- `nixpacks.toml` defines a start command with `npx serve dist -l $PORT`.
- There are multiple deployment patterns/config files (`serve`, Docker, and an Express server file). Align these before production hardening to avoid drift.

## Folder Structure
```text
.
├─ src/
│  ├─ App.jsx          # Main SPA with all screens/components/data in one file
│  └─ main.jsx         # React entry point
├─ dist/               # Built static assets (generated)
├─ index.html          # Vite HTML entry for development/build
├─ package.json        # Scripts + dependencies
├─ vite.config.js      # Vite config
├─ server.js           # Express static server (not wired to scripts)
├─ Dockerfile          # Static runtime image using prebuilt dist/
├─ railway.json        # Railway Dockerfile build config
├─ nixpacks.toml       # Nixpacks start command
└─ REPOSITORY_REVIEW.md
```

## Important Files
- `src/App.jsx`: Contains UI components, screen routing-by-state, workout/stretch/recovery data, timers, and persistence logic.
- `src/main.jsx`: Mounts the React app.
- `package.json`: Source of truth for local dev/build/start commands.
- `Dockerfile`: Container runtime currently expects pre-existing `dist/`.
- `server.js`: Alternative Express server implementation not used by npm scripts.

## Developer Notes (for Codex / Claude / OpenClaw agents)
- Verify behavior from `package.json` scripts first; they define the active runtime path.
- Treat `src/App.jsx` as a high-impact file: many features and datasets are centralized there.
- If adding documentation for features, confirm they are represented in:
  1. `activities` list
  2. corresponding screen component
  3. screen switch logic near the bottom of `App.jsx`
- If changing deploy docs, cross-check `Dockerfile`, `railway.json`, and `nixpacks.toml` together.
- Avoid claiming backend/API functionality unless code is added and wired into scripts.
- Confirm whether `server.js` should remain (legacy/alternative) or be removed for clarity.

## Known Limitations / TODOs visible in code
- Large single-file app (`src/App.jsx`) increases maintenance complexity.
- App data and progress live only in browser storage; no account sync or backend persistence.
- Several exercise images are hotlinked from third-party URLs and may break if remote sources change.
- Deployment path is not fully unified (`serve` scripts vs `server.js` vs multiple deploy configs).
- Docker build currently relies on a prebuilt `dist/`, which can become stale if not rebuilt before deploy.
