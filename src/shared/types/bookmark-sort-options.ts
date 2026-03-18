import type { BookmarkSortBy } from './bookmark-sort-by';
import type { SortDirection } from './sort-direction';

export interface IBookmarkSortOptions {
  sortBy?: BookmarkSortBy;
  direction?: SortDirection;
}
