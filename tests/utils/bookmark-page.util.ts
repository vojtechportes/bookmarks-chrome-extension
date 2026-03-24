import { BrowserContext, Page } from 'playwright/test';
import {
  MOCK_PAGE_CONTENT,
  MOCK_PAGE_TITLE,
  MOCK_PAGE_URL,
} from '../constants';

export interface IBookmarkedPageBody {
  title?: string;
  body?: string;
}

export interface IBookmarkedPageData {
  url?: string;
  content?: IBookmarkedPageBody;
}

export interface IBookmarkPage {
  page: Page;
  context: BrowserContext;
  extensionId: string;
  data?: IBookmarkedPageData;
}

export const bookmarkPage = async ({
  page,
  context,
  extensionId,
  data,
}: IBookmarkPage) => {
  const {
    url = MOCK_PAGE_URL,
    content = {
      title: MOCK_PAGE_TITLE,
      body: MOCK_PAGE_CONTENT,
    },
  } = data ?? {};

  await page.route(url, async (route) => {
    await route.fulfill({
      contentType: 'text/html',
      body: `
        <html>
          <head><title>${content.title}</title></head>
          <body>${content.body}</body>
        </html>
      `,
    });
  });

  await page.goto(url);
  await page.bringToFront();

  const extensionPage = await context.newPage();
  await extensionPage.goto(`chrome-extension://${extensionId}/index.html`);

  // Keep the website tab active
  await page.bringToFront();

  // Click on bookmark button
  await extensionPage.locator('[data-test-value="bookmark"]').click();

  return { extensionPage };
};
