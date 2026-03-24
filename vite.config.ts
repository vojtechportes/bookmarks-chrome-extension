/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'node:path';
import { replaceVarsJsonPlugin } from './.vite/replace-vars-json-plugin';
import { getGitTag } from './.vite/get-git-tag';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
      plugins: [['module:@preact/signals-react-transform']],
    }),
    svgr(),
    replaceVarsJsonPlugin({
      sourceFilePath: 'public/manifest.json',
      outputFilePath: 'manifest.json',
      outputDirectoryPath: 'dist',
      variable: 'VERSION',
      value: getGitTag() ?? '0.0.0',
      replacer: (value) => value.replace('v', ''),
    }),
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
        offscreen: resolve(__dirname, 'src/offscreen/offscreen.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          switch (chunkInfo.name) {
            case 'service-worker':
              return 'service-worker.js';
            case 'offscreen':
              return 'offscreen.js';
            case 'sidepanel':
              return 'assets/[name]-[hash].js';
            default:
              return 'assets/[name]-[hash].js';
          }
        },
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
    exclude: ['**/node_modules/**', '**/.git/**', './tests/**/*.test.ts'],
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
});
