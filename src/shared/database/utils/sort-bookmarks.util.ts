import type { IBookmarkItem } from '../../types/bookmark-item';
import type { IBookmarkSortOptions } from '../../types/bookmark-sort-options';
import { normalizeTitle } from './normalize-title.util';

export const sortBookmarks = (
  bookmarks: IBookmarkItem[],
  options: IBookmarkSortOptions = {},
): IBookmarkItem[] => {
  const { sortBy = 'addedAt', direction = 'desc' } = options;

  return [...bookmarks].sort((left, right) => {
    if (Boolean(left.pinned) !== Boolean(right.pinned)) {
      return left.pinned ? -1 : 1;
    }

    if (sortBy === 'title') {
      const comparison = normalizeTitle(left.title).localeCompare(
        normalizeTitle(right.title),
      );

      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }

      return right.addedAt > left.addedAt ? 1 : -1;
    }

    if (left.addedAt !== right.addedAt) {
      if (direction === 'asc') {
        return left.addedAt > right.addedAt ? 1 : -1;
      }

      return right.addedAt > left.addedAt ? 1 : -1;
    }

    return normalizeTitle(left.title).localeCompare(
      normalizeTitle(right.title),
    );
  });
};
