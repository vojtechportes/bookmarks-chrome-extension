import { BOOKMARK_NOT_FOUND } from '../../shared/constants/error-messages';
import { updateBookmarks } from '../utils/update-bookmarks.util';

export const unpinBookmark = async (id: string) =>
  updateBookmarks((bookmarks) => {
    const exists = bookmarks.some((item) => item.id === id);

    if (!exists) {
      throw new Error(BOOKMARK_NOT_FOUND);
    }

    return bookmarks.map((item) =>
      item.id === id ? { ...item, pinned: false } : item,
    );
  });
