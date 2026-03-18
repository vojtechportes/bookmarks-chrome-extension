import { useEffect, useRef } from 'react';
import { bookmarksChannel } from '../../shared/broadcast/bookmarks-events';
import { BROADCAST_EVENT_NAME } from '../../shared/broadcast/constants';

export const useSynchronizeBookmarks = (reload: () => Promise<void>) => {
  const reloadRef = useRef(reload);

  useEffect(() => {
    reload();
    reloadRef.current = reload;
  }, [reload]);

  useEffect(() => {
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data?.type !== BROADCAST_EVENT_NAME) {
        return;
      }

      reload();
    };

    const handleRuntimeMessage = (message: unknown): undefined => {
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message.type === 'BOOKMARKS_INVALIDATE'
      ) {
        reload();
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
