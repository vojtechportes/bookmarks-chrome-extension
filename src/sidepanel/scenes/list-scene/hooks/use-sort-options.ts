import { BOOKMARKS_SORT_ORDER_STORAGE_KEY } from '../../../../shared/constants/storage';
import type { BookmarkSortBy } from '../../../../shared/types/bookmark-sort-by';
import type { SortDirection } from '../../../../shared/types/sort-direction';
import { useStorage } from '../../../hooks/use-storage';
import type { SortOrder } from '../types/sort-order';

export const useSortOptions = () => {
  const sortOrderStorage = useStorage<SortOrder>(
    BOOKMARKS_SORT_ORDER_STORAGE_KEY,
    'addedAt-desc',
  );

  const [sortBy, direction] = sortOrderStorage.value.split('-');

  return {
    sortBy: sortBy as BookmarkSortBy,
    direction: direction as SortDirection,
  };
};
