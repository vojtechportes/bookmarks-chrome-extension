import { test, expect } from './fixtures';
import { openSettings } from './utils/open-settings.util';

test('open settings through extension UI', async ({ context, extensionId }) => {
  const { extensionPage } = await openSettings({ context, extensionId });

  const href = await extensionPage.evaluate(() => document.location.href);

  expect(href).toBe(`chrome-extension://${extensionId}/index.html#/settings`);
});
