import { activeTabResponseMock } from '../../../__mocks__/active-tab-response.mock';
import type { BookmarkItem } from '../../../shared/types/bookmark-item';
import { BOOKMARKS_STORAGE_KEY } from '../../../shared/constants/storage';
import { storageApi } from '../storage-api/storage-api';
import type { PinBookmarkResponse } from './types/pin-bookmark-response';
import type { IRuntimeApi } from './types/runtime-api';
import type { SetActiveTabResponse } from './types/set-active-tab-response';
import { v4 as uuid } from 'uuid';
import type { UnpinBookmarkResponse } from './types/unpin-bookmark-response';
import { BOOKMARK_NOT_FOUND } from '../../../shared/constants/error-messages';
import type { DelteteAllBookmarksResponse } from './types/delete-all-bookmarks-response';
import type { DeleteBookmarkResponse } from './types/delete-bookmark-response';
import type { OpenBookmarkResponse } from './types/open-bookmark-response';

export class BrowserRuntimeApi implements IRuntimeApi {
  async saveActiveTab(): Promise<SetActiveTabResponse> {
    console.warn('[dev] SAVE_ACTIVE_TAB called outside extension context');

    const id = uuid();
    const response = activeTabResponseMock(id);
    const mockData = response.data;

    const data =
      (await storageApi.get<BookmarkItem[]>(BOOKMARKS_STORAGE_KEY)) ?? [];

    await storageApi.set(BOOKMARKS_STORAGE_KEY, [...data, mockData]);

    return activeTabResponseMock(id);
  }

  async pinBookmark(id: string): Promise<PinBookmarkResponse> {
    console.warn('[dev] PIN_BOOKMARK called outside extension context');

    const data =
      (await storageApi.get<BookmarkItem[]>(BOOKMARKS_STORAGE_KEY)) ?? [];

    const exists = data.some((item) => item.id === id);

    if (!exists) {
      return {
        ok: false,
        error: BOOKMARK_NOT_FOUND,
      };
    }

    const updatedData = data.map((item) =>
      item.id === id ? { ...item, pinned: true } : item,
    );

    await storageApi.set(BOOKMARKS_STORAGE_KEY, updatedData);

    return {
      ok: true,
      data: undefined,
    };
  }

  async unpinBookmark(id: string): Promise<UnpinBookmarkResponse> {
    console.warn('[dev] UNPIN_BOOKMARK called outside extension context');

    const data =
      (await storageApi.get<BookmarkItem[]>(BOOKMARKS_STORAGE_KEY)) ?? [];

    const exists = data.some((item) => item.id === id);

    if (!exists) {
      return {
        ok: false,
        error: BOOKMARK_NOT_FOUND,
      };
    }

    const updatedData = data.map((item) =>
      item.id === id ? { ...item, pinned: false } : item,
    );

    await storageApi.set(BOOKMARKS_STORAGE_KEY, updatedData);

    return {
      ok: true,
      data: undefined,
    };
  }

  async deleteBookmark(id: string): Promise<DeleteBookmarkResponse> {
    console.warn('[dev] DELETE_BOOKMARK called outside extension context');

    const data =
      (await storageApi.get<BookmarkItem[]>(BOOKMARKS_STORAGE_KEY)) ?? [];

    const exists = data.some((item) => item.id === id);

    if (!exists) {
      return {
        ok: false,
        error: BOOKMARK_NOT_FOUND,
      };
    }

    const updatedData = data.filter((item) => item.id !== id);

    await storageApi.set(BOOKMARKS_STORAGE_KEY, updatedData);

    return {
      ok: true,
      data: undefined,
    };
  }

  async deleteAllBookmarks(): Promise<DelteteAllBookmarksResponse> {
    console.warn('[dev] DELETE_ALL_BOOKMARKS called outside extension context');

    await storageApi.set(BOOKMARKS_STORAGE_KEY, []);

    return {
      ok: true,
      data: undefined,
    };
  }

  async openBookmark(url: string): Promise<OpenBookmarkResponse> {
    console.warn('[dev] OPEN_BOOKMARK called outside extension context');

    window.open(url, '_blank')?.focus();

    return {
      ok: true,
      data: undefined,
    };
  }
}
