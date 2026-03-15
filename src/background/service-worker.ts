/// <reference types="chrome-types" />

import type { BookmarkMessage } from "../shared/types/bookmark-message";
import type { BookmarkResponse } from "../shared/types/bookmark-response";
import { handleMessage } from "./utils/handle-message.util";

chrome.runtime.onInstalled.addListener(() => {
  console.log('[bookmark-extension] service worker installed');

  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
      console.error('[bookmark-extension] failed to set side panel behavior', error);
    });
  }
});

chrome.runtime.onMessage.addListener(
  (message: BookmarkMessage, _sender, sendResponse: (response: BookmarkResponse<any>) => void) => {
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
  }
);