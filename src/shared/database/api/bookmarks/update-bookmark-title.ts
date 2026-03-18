import { updateBookmark } from './update-bookmark';

export const updateBookmarkTitle = async (
  bookmarkId: string,
  title: string,
) => {
  return updateBookmark(bookmarkId, (bookmark) => ({
    ...bookmark,
    title,
  }));
};
