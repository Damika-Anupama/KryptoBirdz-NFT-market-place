/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the same dist/ work at the GitHub Pages project subpath
// (/KryptoBirdz-NFT-market-place/) AND at a root domain (Vercel). This is only
// safe with HashRouter — never switch to BrowserRouter without also switching
// base to an absolute path.
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    css: false,
  },
});
