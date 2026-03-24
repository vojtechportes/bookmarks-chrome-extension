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

  // Expect bookmarked item to exist
  await expect(
    extensionPage.locator(
      '[data-test-name="bookmark-item"] [data-test-name="title"]',
    ),
  ).toHaveAttribute('data-test-value', MOCK_PAGE_TITLE);
});
