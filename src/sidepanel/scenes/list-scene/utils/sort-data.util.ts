import type { BookmarkItem } from '../../../../shared/types/bookmark-item';
import type { SortOrder } from '../types/sort-order';

export const sortData = (data: BookmarkItem[], sortOrder: SortOrder) => {
  const sortedData = [...data].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    if (sortOrder === 'newest-to-oldest') {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }

    if (sortOrder === 'oldest-to-newest') {
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    }

    if (sortOrder === 'title-asc') {
      return (a.title ?? '').localeCompare(b.title ?? '', undefined, {
        sensitivity: 'base',
      });
    }

    if (sortOrder === 'title-desc') {
      return (b.title ?? '').localeCompare(a.title ?? '', undefined, {
        sensitivity: 'base',
      });
    }

    return 0;
  });

  return sortedData;
};
