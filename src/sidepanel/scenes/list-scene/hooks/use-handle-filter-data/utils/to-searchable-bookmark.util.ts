import type { IBookmarkItem } from '../../../../../../shared/types/bookmark-item';
import type { SearchableBookmark } from '../types/searchable-bookmark';
import { createSubstringTokens } from './create-substring-tokens.util';

export const toSearchableBookmark = (
  bookmark: IBookmarkItem,
): SearchableBookmark => {
  return {
    ...bookmark,
    searchTitle: createSubstringTokens(bookmark.title).join(' '),
    searchUrl: createSubstringTokens(bookmark.url).join(' '),
  };
};
