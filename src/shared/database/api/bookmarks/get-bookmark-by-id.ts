import type { IBookmarkItem } from '../../../types/bookmark-item';
import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const getBookmarkById = async (
  bookmarkId: string,
): Promise<IBookmarkItem | undefined> => {
  const database = await getDatabase();

  return database.get(BOOKMARKS_STORE, bookmarkId);
};
