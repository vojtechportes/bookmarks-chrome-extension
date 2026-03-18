import type { IBookmarkItem } from '../../types/bookmark-item';

export const getRelatedAssetIds = (bookmark: IBookmarkItem): string[] => {
  return [
    bookmark.iconAssetId,
    bookmark.lightIconAssetId,
    bookmark.darkIconAssetId,
    bookmark.screenshotAssetId,
  ].filter((value): value is string => Boolean(value));
};
