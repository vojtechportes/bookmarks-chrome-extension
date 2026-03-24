import { test, expect } from './fixtures';
import { bookmarkPage } from './utils/bookmark-page.util';

test('pins and unpins bookmarked tab through extension UI', async ({
  page,
  context,
  extensionId,
}) => {
  const { extensionPage } = await bookmarkPage({
    page,
    context,
    extensionId,
  });

  // Click on bookmark item dropdown trigger
  await extensionPage
    .locator(
      '[data-test-name="bookmark-item"] [data-test-value="dropdown-trigger"]',
    )
    .click();

  // Click on pin option
  await extensionPage
    .locator('[data-test-name="dropdown-item"][data-test-value="pin"]')
    .click();

  // Bookmarked tab to be pinned
  await expect(
    extensionPage.locator('[data-test-name="bookmark-item"]'),
  ).toHaveAttribute('data-test-value', 'pinned');

  // Click on bookmark item dropdown trigger
  await extensionPage
    .locator(
      '[data-test-name="bookmark-item"] [data-test-value="dropdown-trigger"]',
    )
    .click();

  // Click on unpin option
  await extensionPage
    .locator('[data-test-name="dropdown-item"][data-test-value="unpin"]')
    .click();

  // Bookmarked tab to be unpinned
  await expect(
    extensionPage.locator('[data-test-name="bookmark-item"]'),
  ).not.toHaveAttribute('data-test-value', '');
});
