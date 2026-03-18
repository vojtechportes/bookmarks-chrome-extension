import type { IBookmarkItem } from '../../../types/bookmark-item';
import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';
import { BookmarkAlreadyExistsError } from '../../errors/bookmark-already-exists-error';

export const addBookmark = async (
  bookmark: IBookmarkItem,
): Promise<IBookmarkItem> => {
  const database = await getDatabase();
  const normalizedBookmark: IBookmarkItem = {
    ...bookmark,
    pinned: bookmark.pinned ?? false,
  };

  try {
    await database.add(BOOKMARKS_STORE, normalizedBookmark);

    return normalizedBookmark;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'ConstraintError') {
      throw new BookmarkAlreadyExistsError();
    }

    throw error;
  }
};
