import { setBookmarks } from "./set-bookmarks";

export const deleteAllBookmarks = async (): Promise<void> => {
  await setBookmarks([]);
};
