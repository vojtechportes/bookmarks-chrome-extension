import type { IBookmarkItem } from '../../../../../../shared/types/bookmark-item';

export type SearchableBookmark = IBookmarkItem & {
  searchTitle: string;
  searchUrl: string;
};
