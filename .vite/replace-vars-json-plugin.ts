/// <reference types="vitest/config" />

import { type Plugin } from 'vite';
import { resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export interface IReplaceVarsJsonPluginOptions {
  sourceFilePath: string;
  outputDirectoryPath: string;
  outputFilePath: string;
  variable: string;
  value: string;
  replacer?: (value: string) => string;
}

export const replaceVarsJsonPlugin = ({
  outputDirectoryPath,
  outputFilePath,
  sourceFilePath,
  value,
  variable,
  replacer,
}: IReplaceVarsJsonPluginOptions): Plugin => ({
  name: 'replace-vars-json',
  apply: 'build',
  writeBundle() {
    const sourceFile = resolve(__dirname, '..', sourceFilePath);
    const outputDir = resolve(__dirname, '..', outputDirectoryPath);
    const outputFile = resolve(outputDir, outputFilePath);

    const content = readFileSync(sourceFile, 'utf-8');

    const replaced = content.replaceAll(
      `{${variable}}`,
      replacer ? replacer(value) : value,
    );

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputFile, replaced, 'utf-8');
  },
});
