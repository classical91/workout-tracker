# Repository Review (status of known issues)

This tracks the bugs/inconsistencies previously identified and their current status.

## 1) Build script `vite: Permission denied` — ✅ Resolved

- **File:** `package.json`
- **Issue:** Scripts used the shell shim (`vite build`), which depends on execute
  permissions in `node_modules/.bin/vite`. In some environments that file was not
  executable, causing build failure.
- **Resolution:** Scripts now invoke Vite through Node directly:
  - `node ./node_modules/vite/bin/vite.js build`
  - `node ./node_modules/vite/bin/vite.js`

## 2) Runtime entrypoint inconsistency (`server.js` vs npm `start`) — ✅ Resolved

- **Files:** `server.js`, `package.json`
- **Issue:** A legacy `server.js` used Express, but `start` used `serve` and `express`
  was not a dependency, creating ambiguity about the intended production server.
- **Resolution:** The app is committed to a **static-only** model. `server.js` has been
  removed and `start` runs `serve dist`. There is no Express dependency and no backend.

## 3) Docker image serves prebuilt `dist` only (no build step) — ✅ Resolved

- **File:** `Dockerfile`
- **Issue:** The image copied only `dist/`, so forgetting to rebuild could ship stale assets.
- **Resolution:** The `Dockerfile` is now multi-stage: it runs `npm ci && npm run build`
  in-container, then copies the freshly built `dist/` into a minimal `serve` runtime image.

## 4) Mixed deployment patterns can drift — ✅ Mostly resolved

- **Files:** `Dockerfile`, `package.json`, `railway.json`, `nixpacks.toml`
- **Issue:** Multiple deployment paths existed (serve, Express, Docker static image).
- **Resolution:** The canonical path is **Vite build → static `dist/` → `serve`**, and the
  Express path is gone. One residual nuance remains: `nixpacks.toml` serves `dist/` without
  building, so it relies on a committed `dist/`. Railway uses the Dockerfile (which builds),
  so this only matters if the builder is switched. Documented in `README.md`.

## 5) Duplicate daily log entries dropped — ✅ Resolved

- **File:** `src/App.jsx` (now `src/hooks/useWorkoutLog.js`)
- **Issue:** `addLog` de-duplicated by `name + day`, so doing the same activity twice in a
  day (e.g. Bike) only logged once — incorrect for a tracker.
- **Resolution:** Log logic moved into `useWorkoutLog`, which keeps every completed session
  so the log reflects what the user actually did.

## 6) Silent `localStorage` save failures — ✅ Resolved

- **File:** `src/hooks/useLocalStorage.js`
- **Issue:** Save errors (storage full, disabled, private browsing) were swallowed, so users
  could lose progress without any indication.
- **Resolution:** `useLocalStorage` now reports a save error, and `App` renders a
  non-blocking warning banner (`StorageWarning`) when a write fails.

## 7) Heavy dependence on third-party image URLs — ✅ Resolved

- **Files:** `src/data/workouts.js`, `src/data/triggerPoints.js`, `src/screens/WorkoutSetsScreen.jsx`,
  `src/components/TriggerPointCard.jsx`
- **Issue:** Many exercise images were hotlinked from external domains (YouTube thumbnails and
  fitness sites). If a host blocked hotlinking or removed content, the media silently disappeared.
- **Resolution:** Hotlinked images were removed in favor of links (the same pattern the stretches
  screen already used). Workout exercises link to a Google image search; trigger points link to
  their instructional YouTube videos (using the IDs the thumbnails were derived from). No remote
  images are embedded, so there is nothing left to break.
