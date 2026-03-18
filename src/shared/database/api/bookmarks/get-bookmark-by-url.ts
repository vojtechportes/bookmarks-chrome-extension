import type { IBookmarkItem } from '../../../types/bookmark-item';
import { BOOKMARK_URL_INDEX, BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const getBookmarkByUrl = async (
  url: string,
): Promise<IBookmarkItem | undefined> => {
  const database = await getDatabase();

  return database.getFromIndex(BOOKMARKS_STORE, BOOKMARK_URL_INDEX, url);
};
