import { updateBookmark } from './update-bookmark';

export const updateBookmarkDescriptionStatus = async (
  bookmarkId: string,
  isGeneratingDescription: boolean,
) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    isGeneratingDescription,
    updatedAt: new Date().toISOString(),
  }));
};
