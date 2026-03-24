import { test, expect } from './fixtures';
import { bookmarkPage } from './utils/bookmark-page.util';

test('deletes all bookmarked tabs through extension UI', async ({
  page,
  context,
  extensionId,
}) => {
  const { extensionPage } = await bookmarkPage({
    page,
    context,
    extensionId,
  });

  // Click on filters options dropdown trigger
  await extensionPage
    .locator(
      '[data-test-name="filters"] [data-test-name="options"] [data-test-value="dropdown-trigger"]',
    )
    .click();

  // Click on delete all option
  await extensionPage
    .locator('[data-test-name="dropdown-item"][data-test-value="delete-all"]')
    .click();

  // Delete all dialog should open
  await expect(
    extensionPage.locator('[data-test-name="dialog"]'),
  ).toHaveAttribute('data-test-value', 'delete-all');

  await extensionPage
    .locator('[data-test-name="dialog"] [data-test-value="confirm"]')
    .click();

  // Extension should be in a empty state
  await expect(
    extensionPage.locator(
      '[data-test-name="panel"] [data-test-name="typography"]',
    ),
  ).toHaveAttribute('data-test-value', 'no-data.title');
});
