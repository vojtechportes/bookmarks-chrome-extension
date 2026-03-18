export interface IBookmarksContext {
  hasBookmarks: boolean;
  isLoadingHasBookmarks: boolean;
  reloadHasBookmarks: () => Promise<void>;
}
