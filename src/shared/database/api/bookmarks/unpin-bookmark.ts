import { updateBookmark } from './update-bookmark';

export const unpinBookmark = async (bookmarkId: string) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    pinned: false,
  }));
};
