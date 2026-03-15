import { BOOKMARKS_STORAGE_KEY } from "../../shared/constants/storage";
import type { BookmarkItem } from "../../shared/types/bookmark-item";

export const setBookmarks = async (
  bookmarks: BookmarkItem[],
): Promise<void> => {
  await chrome.storage.local.set({
    [BOOKMARKS_STORAGE_KEY]: bookmarks,
  });
};
