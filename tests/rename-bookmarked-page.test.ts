import { MOCK_PAGE_TITLE } from './constants';
import { test, expect } from './fixtures';
import { bookmarkPage } from './utils/bookmark-page.util';

test('bookmarks active tab through extension UI', async ({
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

  // Click on rename option
  await extensionPage
    .locator('[data-test-name="dropdown-item"][data-test-value="rename"]')
    .click();

  // Rename dialog should open
  await expect(
    extensionPage.locator('[data-test-name="dialog"]'),
  ).toHaveAttribute('data-test-value', 'rename');

  const newName = `${MOCK_PAGE_TITLE} Renamed`;

  await extensionPage
    .locator('[data-test-name="dialog"] [data-test-value="title"]')
    .fill(newName);

  await extensionPage
    .locator('[data-test-name="dialog"] [data-test-value="confirm"]')
    .click();

  // Expect bookmarked item to be renamed
  await expect(
    extensionPage.locator(
      '[data-test-name="bookmark-item"] [data-test-name="title"]',
    ),
  ).toHaveAttribute('data-test-value', newName);
});
