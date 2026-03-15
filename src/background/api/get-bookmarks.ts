import { BOOKMARKS_STORAGE_KEY } from "../../shared/constants/storage";
import type { BookmarkItem } from "../../shared/types/bookmark-item";

export const getBookmarks = async (): Promise<BookmarkItem[]> => {
  const result = await chrome.storage.local.get(BOOKMARKS_STORAGE_KEY);
  const bookmarks = result[BOOKMARKS_STORAGE_KEY];

  if (!Array.isArray(bookmarks)) {
    return [];
  }

  return bookmarks as BookmarkItem[];
};
