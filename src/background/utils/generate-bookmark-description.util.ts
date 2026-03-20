import { updateBookmarkDescription } from '../../shared/database/api/bookmarks/update-bookmark-description';
import { updateBookmarkDescriptionStatus } from '../../shared/database/api/bookmarks/update-bookmark-description-status';
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
    updateBookmarkDescriptionStatus(bookmarkId, false);
  } finally {
    bookmarksChanged();
  }
};
