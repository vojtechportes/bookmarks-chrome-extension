import { FAILED_TO_SUMMARIZE_TEXT } from '../../shared/constants/error-messages';
import { GENERATE_BOOKMARK_DESCRIPTION } from '../../shared/constants/operations';
import { updateBookmarkDescription } from '../../shared/database/api/bookmarks/update-bookmark-description';
import { updateBookmarkDescriptionStatus } from '../../shared/database/api/bookmarks/update-bookmark-description-status';
import { logger } from '../../shared/logger/logger';
import { bookmarksChanged } from '../api/bookmarks-changed';
import { summarizeActiveTab } from '../api/summarize-active-tab';

export const generateBookmarkDescription = async (
  bookmarkId: string,
): Promise<void> => {
  try {
    const summary = await summarizeActiveTab({
      options: {
        format: 'plain-text',
        length: 'short',
        type: 'tldr',
        outputLanguage: 'en',
      },
    });

    await updateBookmarkDescription(bookmarkId, summary);
  } catch {
    logger('warn', FAILED_TO_SUMMARIZE_TEXT, {
      operation: GENERATE_BOOKMARK_DESCRIPTION,
      scope: 'service-worker',
      bookmarkId,
    });

    updateBookmarkDescriptionStatus(bookmarkId, false);
  } finally {
    bookmarksChanged();
  }
};
