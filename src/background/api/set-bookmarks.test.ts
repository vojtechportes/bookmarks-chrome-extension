import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setBookmarks } from './set-bookmarks';
import { BOOKMARKS_STORAGE_KEY } from '../../shared/constants/storage';
import type { BookmarkItem } from '../../shared/types/bookmark-item';

describe('setBookmarks', () => {
  const setMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          set: setMock,
        },
      },
    });
  });

  it('stores bookmarks in chrome.storage.local', async () => {
    const bookmarks: BookmarkItem[] = [
      {
        id: '1',
        title: 'Example',
        url: 'https://example.com',
        addedAt: new Date().toISOString(),
        pinned: false,
      } as BookmarkItem,
    ];

    await setBookmarks(bookmarks);

    expect(setMock).toHaveBeenCalledTimes(1);
    expect(setMock).toHaveBeenCalledWith({
      [BOOKMARKS_STORAGE_KEY]: bookmarks,
    });
  });

  it('stores an empty array', async () => {
    await setBookmarks([]);

    expect(setMock).toHaveBeenCalledWith({
      [BOOKMARKS_STORAGE_KEY]: [],
    });
  });
});
