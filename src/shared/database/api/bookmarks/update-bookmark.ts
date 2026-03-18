import type { IBookmarkItem } from '../../../types/bookmark-item';
import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';
import { BookmarkNotFoundError } from '../../errors/bookmark-not-found-error';

export const updateBookmark = async (
  bookmarkId: string,
  updater: (bookmark: IBookmarkItem) => IBookmarkItem,
): Promise<IBookmarkItem> => {
  const db = await getDatabase();
  const transaction = db.transaction(BOOKMARKS_STORE, 'readwrite');

  try {
    const store = transaction.objectStore(BOOKMARKS_STORE);
    const bookmark = await store.get(bookmarkId);

    if (!bookmark) {
      throw new BookmarkNotFoundError();
    }

    const updatedBookmark = updater(bookmark);

    await store.put(updatedBookmark);
    await transaction.done;

    return updatedBookmark;
  } catch (error) {
    transaction.abort();
    throw error;
  }
};
