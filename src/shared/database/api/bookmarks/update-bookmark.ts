import {
  BOOKMARK_NOT_FOUND,
  TRANSACTION_ABORTED,
} from '../../../constants/error-messages';
import { logger } from '../../../logger/logger';
import type { IBookmarkItem } from '../../../types/bookmark-item';
import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';
import { BookmarkNotFoundError } from '../../errors/bookmark-not-found-error';

export const updateBookmark = async (
  bookmarkId: string,
  updater: (bookmark: IBookmarkItem) => IBookmarkItem,
): Promise<IBookmarkItem> => {
  const database = await getDatabase();
  const transaction = database.transaction(BOOKMARKS_STORE, 'readwrite');

  try {
    const store = transaction.objectStore(BOOKMARKS_STORE);
    const bookmark = await store.get(bookmarkId);

    if (!bookmark) {
      logger('error', BOOKMARK_NOT_FOUND, {
        scope: 'database',
      });

      throw new BookmarkNotFoundError();
    }

    const updatedBookmark = updater(bookmark);

    await store.put(updatedBookmark);
    await transaction.done;

    return updatedBookmark;
  } catch (error) {
    logger(
      'error',
      TRANSACTION_ABORTED,
      {
        scope: 'database',
      },
      error,
    );

    transaction.abort();
    throw error;
  }
};
