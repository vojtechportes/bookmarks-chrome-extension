import type { BookmarksChangedResponse } from '../../../shared/types/bookmarks-changed-response';
import type { OpenBookmarkResponse } from './types/open-bookmark-response';
import type { IRuntimeApi } from './types/runtime-api';
import type { SetActiveTabResponse } from './types/set-active-tab-response';
import type { SummarizeTextResponse } from './types/summarize-response';

export class ChromeRuntimeApi implements IRuntimeApi {
  async saveActiveTab(): Promise<SetActiveTabResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'SAVE_ACTIVE_TAB',
    });

    return response as SetActiveTabResponse;
  }

  async openBookmark(url: string): Promise<OpenBookmarkResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'OPEN_BOOKMARK',
      payload: { url },
    });

    return response as OpenBookmarkResponse;
  }

  async summarizeActiveTab(
    options?: SummarizerCreateOptions,
  ): Promise<SummarizeTextResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'SUMMARIZE_ACTIVE_TAB',
      payload: { options },
    });

    return response as SummarizeTextResponse;
  }

  async notifyBookmarksChanged(): Promise<BookmarksChangedResponse> {
    const response = await chrome.runtime.sendMessage({
      type: 'BOOKMARKS_CHANGED',
    });

    return response as BookmarksChangedResponse;
  }
}
