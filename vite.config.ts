/// <reference types="vitest/config" />

import { defineConfig, loadEnv, type Plugin } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const replaceVarsJsonPlugin = (env: Record<string, string>): Plugin => ({
  name: 'replace-vars-json',
  apply: 'build',
  writeBundle() {
    const sourceFile = resolve(__dirname, 'public/manifest.json');
    const outputDir = resolve(__dirname, 'dist');
    const outputFile = resolve(outputDir, 'manifest.json');

    const content = readFileSync(sourceFile, 'utf-8');

    const replaced = content.replaceAll(
      '{EXTENSION_OAUTH_CLIENT_ID}',
      env.EXTENSION_OAUTH_CLIENT_ID ?? '',
    );

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputFile, replaced, 'utf-8');
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      svgr(),
      replaceVarsJsonPlugin(env),
    ],
    server: {
      watch: {
        ignored: ['**/coverage/**'],
      },
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rolldownOptions: {
        input: {
          sidepanel: resolve(__dirname, 'index.html'),
          'service-worker': resolve(
            __dirname,
            'src/background/service-worker.ts',
          ),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.d.ts',
          'src/main.tsx',
          'src/**/index.ts',
          'src/**/*.mock.*',
          'src/**/constants/*.ts',
          'src/**/types/*.ts',
          'src/**/i18n/*.ts',
        ],
      },
    },
  };
});
