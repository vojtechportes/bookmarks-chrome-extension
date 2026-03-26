import { updateBookmark } from './update-bookmark';
import escapeHTML from 'escape-html';

export const updateBookmarkTitle = async (
  bookmarkId: string,
  title: string,
) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    title: escapeHTML(title),
    updatedAt: new Date().toISOString(),
  }));
};
