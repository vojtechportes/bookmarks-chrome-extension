/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import svgr from "vite-plugin-svgr";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        sidepanel: resolve(__dirname, "index.html"),
        "service-worker": resolve(
          __dirname,
          "src/background/service-worker.ts",
        ),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/main.tsx", "src/**/index.ts", "src/**/*.mock.*"],
    },
  },
});
