/// <reference types="chrome-types" />

import { FAILED_TO_SET_SIDEPANEL } from '../shared/constants/error-messages';
import { SERVICE_WORKER_INSTALLED } from '../shared/constants/info-messages';
import { logger } from '../shared/logger/logger';
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
  logger('info', SERVICE_WORKER_INSTALLED, {
    scope: 'service-worker',
  });

  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => {
        logger(
          'error',
          FAILED_TO_SET_SIDEPANEL,
          {
            scope: 'service-worker',
          },
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
