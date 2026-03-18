import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { hasBookmarks } from '../../../shared/database/api/bookmarks/has-bookmarks';
import { BROADCAST_EVENT_NAME } from '../../../shared/broadcast/constants';
import { bookmarksChannel } from '../../../shared/broadcast/bookmarks-events';
import { BookmarksContext } from './components/bookmarks-context';

export const BookmarksProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hasAnyBookmarks, setHasAnyBookmarks] = useState(false);
  const [isLoadingHasBookmarks, setIsLoadingHasBookmarks] = useState(true);

  const reloadHasBookmarks = useCallback(async () => {
    try {
      setIsLoadingHasBookmarks(true);
      const result = await hasBookmarks();
      setHasAnyBookmarks(result);
    } finally {
      setIsLoadingHasBookmarks(false);
    }
  }, []);

  useEffect(() => {
    void reloadHasBookmarks();
  }, [reloadHasBookmarks]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.type !== BROADCAST_EVENT_NAME) {
        return;
      }

      void reloadHasBookmarks();
    };

    bookmarksChannel.addEventListener('message', listener);

    return () => {
      bookmarksChannel.removeEventListener('message', listener);
    };
  }, [reloadHasBookmarks]);

  const value = useMemo(
    () => ({
      hasBookmarks: hasAnyBookmarks,
      isLoadingHasBookmarks,
      reloadHasBookmarks,
    }),
    [hasAnyBookmarks, isLoadingHasBookmarks, reloadHasBookmarks],
  );

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};
