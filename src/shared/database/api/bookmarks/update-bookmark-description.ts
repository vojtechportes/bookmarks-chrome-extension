import escapeHTML from 'escape-html';
import { updateBookmark } from './update-bookmark';

export const updateBookmarkDescription = async (
  bookmarkId: string,
  description: string,
) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    description: escapeHTML(description),
    isGeneratingDescription: false,
    updatedAt: new Date().toISOString(),
  }));
};
