import { v4 as uuid } from 'uuid';
import { activeTabResponseMock } from '../../../__mocks__/active-tab-response.mock';
import { addBookmark } from '../../../shared/database/api/bookmarks/add-bookmark';
import { BOOKMARK_ALREADY_EXISTS } from '../../../shared/constants/error-messages';
import type { IBookmarkItem } from '../../../shared/types/bookmark-item';
import type { IRuntimeApi } from './types/runtime-api';
import type { OpenBookmarkResponse } from './types/open-bookmark-response';
import type { SetActiveTabResponse } from './types/set-active-tab-response';
import { notifyBookmarksChanged } from '../../../shared/broadcast/bookmarks-events';
import type { BookmarksChangedResponse } from '../../../shared/types/bookmarks-changed-response';
import type { SummarizeTextResponse } from './types/summarize-response';

export class BrowserRuntimeApi implements IRuntimeApi {
  async saveActiveTab(): Promise<SetActiveTabResponse> {
    console.warn('[dev] SAVE_ACTIVE_TAB called outside extension context');

    const id = uuid();
    const activeTabMock = activeTabResponseMock(id);

    const mockData: IBookmarkItem = {
      ...activeTabMock.data,
      id,
      addedAt: new Date().toISOString(),
      url: window.location.href,
    };

    try {
      const response = await addBookmark(mockData);

      notifyBookmarksChanged();

      return {
        ok: true,
        data: response,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === BOOKMARK_ALREADY_EXISTS) {
        return {
          ok: false,
          error: BOOKMARK_ALREADY_EXISTS,
        };
      }

      throw error;
    }
  }

  async openBookmark(url: string): Promise<OpenBookmarkResponse> {
    console.warn('[dev] OPEN_BOOKMARK called outside extension context');

    window.open(url, '_blank')?.focus();

    return {
      ok: true,
      data: undefined,
    };
  }

  async summarizeActiveTab(
    options?: SummarizerCreateOptions,
  ): Promise<SummarizeTextResponse> {
    console.warn(
      '[dev] SUMMARIZE_ACTIVE_TAB called outside extension context with parameters',
      'options',
      options,
    );

    return {
      ok: true,
      data: 'Mock summary',
    };
  }

  async notifyBookmarksChanged(): Promise<BookmarksChangedResponse> {
    notifyBookmarksChanged();

    return {
      ok: true,
      data: undefined,
    };
  }
}
