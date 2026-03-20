import { useCallback, useState } from 'react';
import { hasBookmarks } from '../../shared/database/api/bookmarks/has-bookmarks';
import { useSynchronizeBookmarks } from './use-synchronize-bookmarks';
import { FAILED_TO_CHECK_BOOKMARKS } from '../../shared/constants/error-messages';

export interface IUseHasBookmarksResult {
  hasBookmarks: boolean;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export const useHasBookmarks = (): IUseHasBookmarksResult => {
  const [hasAnyBookmarks, setHasAnyBookmarks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadHasBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await hasBookmarks();
      setHasAnyBookmarks(result);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error(FAILED_TO_CHECK_BOOKMARKS),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useSynchronizeBookmarks(loadHasBookmarks);

  return {
    hasBookmarks: hasAnyBookmarks,
    isLoading,
    error,
    reload: loadHasBookmarks,
  };
};
