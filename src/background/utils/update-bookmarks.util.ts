import type { BookmarkItem } from '../../shared/types/bookmark-item';
import { getBookmarks } from '../api/get-bookmarks';
import { setBookmarks } from '../api/set-bookmarks';

export const updateBookmarks = async (
  updater: (bookmarks: BookmarkItem[]) => BookmarkItem[],
) => {
  const bookmarks = await getBookmarks();
  const updated = updater(bookmarks);

  await setBookmarks(updated);
};
