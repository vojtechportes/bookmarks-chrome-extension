/// <reference types="chrome-types" />

import type { BookmarkMessage } from '../shared/types/bookmark-message';
import type { BookmarkResponse } from '../shared/types/bookmark-response';
import { handleMessage } from './utils/handle-message.util';

const BOOKMARKS_SYNC_PORT = 'bookmarks-sync';

const ports = new Set<chrome.runtime.Port>();

export const initBookmarksSync = () => {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== BOOKMARKS_SYNC_PORT) {
      return;
    }

    ports.add(port);

    port.onDisconnect.addListener(() => {
      ports.delete(port);
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('[bookmark-extension] service worker installed');

  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => {
        console.error(
          '[bookmark-extension] failed to set side panel behavior',
          error,
        );
      });
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: BookmarkMessage,
    _sender,
    sendResponse: (response: BookmarkResponse<unknown>) => void,
  ) => {
    void handleMessage(message)
      .then(sendResponse)
      .catch((error: unknown) => {
        console.error('[bookmark-extension] unhandled message error', error);

        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });

    return true;
  },
);
