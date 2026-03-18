import { useEffect, useRef } from 'react';
import { bookmarksChannel } from '../../shared/broadcast/bookmarks-events';
import { BROADCAST_EVENT_NAME } from '../../shared/broadcast/constants';

export const useSynchronizeBookmarks = (reload: () => Promise<void>) => {
  const reloadRef = useRef(reload);

  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const triggerReload = () => {
      void reloadRef.current();
    };

    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data?.type !== BROADCAST_EVENT_NAME) {
        return;
      }

      triggerReload();
    };

    const handleRuntimeMessage = (message: unknown): undefined => {
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message.type === 'BOOKMARKS_INVALIDATE'
      ) {
        triggerReload();
      }

      return undefined;
    };

    bookmarksChannel.addEventListener('message', handleBroadcastMessage);

    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    }

    return () => {
      bookmarksChannel.removeEventListener('message', handleBroadcastMessage);

      if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
      }
    };
  }, []);
};
