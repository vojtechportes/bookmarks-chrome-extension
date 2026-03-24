import { BrowserContext } from 'playwright/test';

export interface IOpenSettings {
  context: BrowserContext;
  extensionId: string;
}

export const openSettings = async ({ context, extensionId }: IOpenSettings) => {
  const extensionPage = await context.newPage();
  await extensionPage.goto(`chrome-extension://${extensionId}/index.html`);

  await extensionPage
    .locator('[data-test-name="icon-button"][data-test-value="settings"]')
    .click();

  return { extensionPage };
};
