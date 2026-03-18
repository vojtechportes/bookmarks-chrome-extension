import type { IBookmarkItem } from '../../../types/bookmark-item';
import type { IBookmarkSortOptions } from '../../../types/bookmark-sort-options';
import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';
import { sortBookmarks } from '../../utils/sort-bookmarks.util';

export const getAllBookmarks = async (
  options: IBookmarkSortOptions = {},
): Promise<IBookmarkItem[]> => {
  const database = await getDatabase();
  const bookmarks = await database.getAll(BOOKMARKS_STORE);

  return sortBookmarks(bookmarks, options);
};
