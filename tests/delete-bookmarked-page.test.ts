import { test, expect } from './fixtures';
import { bookmarkPage } from './utils/bookmark-page.util';

test('deletes bookmarked tab through extension UI', async ({
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

  // Click on delete option
  await extensionPage
    .locator('[data-test-name="dropdown-item"][data-test-value="delete"]')
    .click();

  // Extension should be in a empty state
  await expect(
    extensionPage.locator(
      '[data-test-name="panel"] [data-test-name="typography"]',
    ),
  ).toHaveAttribute('data-test-value', 'no-data.title');
});
