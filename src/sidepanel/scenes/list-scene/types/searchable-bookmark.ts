import type { IBookmarkItem } from '../../../../shared/types/bookmark-item';

export type SearchableBookmark = IBookmarkItem & {
  id: string;
};
