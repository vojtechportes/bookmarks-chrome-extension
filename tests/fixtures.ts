// tests/fixtures.ts
import {
  test as base,
  chromium,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Fixtures = {
  context: BrowserContext;
  page: Page;
  extensionId: string;
};

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.resolve(__dirname, '../dist');
    const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pw-ext-'));

    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers();

    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }

    const extensionId = new URL(serviceWorker.url()).host;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(extensionId);
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export const expect = test.expect;
