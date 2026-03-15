import type { BookmarkItem } from '../../../../shared/types/bookmark-item';

export type SearchableBookmark = BookmarkItem & {
  id: string;
};
