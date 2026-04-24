# Repository Review (bugs, inconsistencies, break risks)

## 1) Build script can fail with `vite: Permission denied`
- **File:** `package.json`
- **Issue:** Scripts used the shell shim (`vite build`), which depends on execute permissions in `node_modules/.bin/vite`. In this environment, that file was not executable, causing build failure.
- **Suggested fix:** Invoke Vite through Node directly in npm scripts:
  - `node ./node_modules/vite/bin/vite.js build`
  - `node ./node_modules/vite/bin/vite.js`

## 2) Runtime entrypoint inconsistency (`server.js` vs npm `start`)
- **Files:** `server.js`, `package.json`
- **Issue:** `server.js` uses Express, but `start` uses `serve`, and `express` is not listed as a dependency. This creates ambiguity about the intended production server and can break deploys if a platform runs `node server.js`.
- **Suggested fix:** Pick one approach:
  1. **Static-only:** remove `server.js` and keep `serve`-based start, or
  2. **Express:** add `express` dependency and change `start` to `node server.js`.

## 3) Docker image serves prebuilt `dist` only (no build step)
- **File:** `Dockerfile`
- **Issue:** The image copies only `dist/`. If developers forget to rebuild `dist` before shipping, production can serve stale assets.
- **Suggested fix:** Use a multi-stage Docker build that runs `npm ci && npm run build` in-container, then copies generated `dist` into a minimal runtime image.

## 4) Mixed deployment patterns can drift
- **Files:** `Dockerfile`, `server.js`, `package.json`, `railway.json`
- **Issue:** Multiple valid deployment paths exist (serve, Express, Docker static image). Without clear single-source deployment docs, teams may deploy with different assumptions.
- **Suggested fix:** Document one canonical deployment path and align scripts/configs around it.

## 5) Heavy dependence on third-party image URLs
- **File:** `src/App.jsx`
- **Issue:** Many exercise images are loaded from external domains. If any host blocks hotlinking or removes content, UI media silently disappears.
- **Suggested fix:** Host critical assets in your own static bucket/repo (or add local fallbacks/placeholders and health checks).
