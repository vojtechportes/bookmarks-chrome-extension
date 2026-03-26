import { useCallback, useState } from 'react';
import type { IBookmarkItem } from '../../shared/types/bookmark-item';
import type { IBookmarkSortOptions } from '../../shared/types/bookmark-sort-options';
import { getAllBookmarks } from '../../shared/database/api/bookmarks/get-all-bookmarks';
import { useSynchronizeBookmarks } from './use-synchronize-bookmarks';
import { FAILED_TO_LOAD_BOOKMARKS } from '../../shared/constants/error-messages';
import { logger } from '../../shared/logger/logger';

export interface IUseGetBookmarksResult {
  bookmarks: IBookmarkItem[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export const useGetBookmarks = (
  options: IBookmarkSortOptions = {},
): IUseGetBookmarksResult => {
  const { sortBy, direction } = options;

  const [bookmarks, setBookmarks] = useState<IBookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllBookmarks({ sortBy, direction });

      setBookmarks(result);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error : new Error(FAILED_TO_LOAD_BOOKMARKS);

      logger('error', errorMessage.message, { scope: 'sidepanel' }, error);

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, direction]);

  useSynchronizeBookmarks(loadBookmarks);

  return {
    bookmarks,
    isLoading,
    error,
    reload: loadBookmarks,
  };
};
