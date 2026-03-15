export const isBookmarkableUrl = (url: string): boolean =>
  /^https?:\/\//i.test(url);
