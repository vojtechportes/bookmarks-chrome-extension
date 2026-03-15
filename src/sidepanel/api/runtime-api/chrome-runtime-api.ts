import type { DelteteAllBookmarksResponse } from './types/delete-all-bookmarks-response';
import type { DeleteBookmarkResponse } from './types/delete-bookmark-response';
import type { OpenBookmarkResponse } from './types/open-bookmark-response';
import type { PinBookmarkResponse } from './types/pin-bookmark-response';
import type { IRuntimeApi } from './types/runtime-api';
import type { SetActiveTabResponse } from './types/set-active-tab-response';
import type { UnpinBookmarkResponse } from './types/unpin-bookmark-response';

export class ChromeRuntimeApi implements IRuntimeApi {
  async saveActiveTab(): Promise<SetActiveTabResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'SAVE_ACTIVE_TAB',
    });

    return response as SetActiveTabResponse;
  }

  async pinBookmark(id: string): Promise<PinBookmarkResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'PIN_BOOKMARK',
      payload: { id },
    });

    return response as PinBookmarkResponse;
  }

  async unpinBookmark(id: string): Promise<UnpinBookmarkResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'UNPIN_BOOKMARK',
      payload: { id },
    });

    return response as UnpinBookmarkResponse;
  }

  async deleteBookmark(id: string): Promise<DeleteBookmarkResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'DELETE_BOOKMARK',
      payload: { id },
    });

    return response as DeleteBookmarkResponse;
  }

  async deleteAllBookmarks(): Promise<DelteteAllBookmarksResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'DELETE_ALL_BOOKMARKS',
    });

    return response;
  }

  async openBookmark(url: string): Promise<OpenBookmarkResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'OPEN_BOOKMARK',
      payload: { url },
    });

    return response as OpenBookmarkResponse;
  }
}
