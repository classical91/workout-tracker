import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  // In dev, forward sync API calls to the local Node server (npm run serve).
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    restoreMocks: true,
  },
});
