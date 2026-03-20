import { updateBookmark } from './update-bookmark';

export const updateBookmarkDescription = async (
  bookmarkId: string,
  description: string,
) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    description,
    isGeneratingDescription: false,
    updatedAt: new Date().toISOString(),
  }));
};
