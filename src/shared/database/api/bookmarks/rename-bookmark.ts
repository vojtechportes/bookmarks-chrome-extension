import { updateBookmark } from './update-bookmark';

export const renameBookmark = async (bookmarkId: string, title: string) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    title,
  }));
};
