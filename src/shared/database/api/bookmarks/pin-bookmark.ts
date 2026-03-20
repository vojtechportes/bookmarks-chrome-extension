import { updateBookmark } from './update-bookmark';

export const pinBookmark = async (bookmarkId: string) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    pinned: true,
    updatedAt: new Date().toISOString(),
  }));
};
