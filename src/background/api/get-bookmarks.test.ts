import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBookmarks } from './get-bookmarks';
import { BOOKMARKS_STORAGE_KEY } from '../../shared/constants/storage';
import type { BookmarkItem } from '../../shared/types/bookmark-item';

vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn(),
    },
  },
});

describe('getBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns bookmarks from storage', async () => {
    const bookmarks: BookmarkItem[] = [
      { id: '1', title: 'Test' } as BookmarkItem,
    ];

    (
      vi.mocked(chrome.storage.local.get) as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      [BOOKMARKS_STORAGE_KEY]: bookmarks,
    });

    const result = await getBookmarks();

    expect(result).toEqual(bookmarks);
    expect(chrome.storage.local.get).toHaveBeenCalledWith(
      BOOKMARKS_STORAGE_KEY,
    );
  });

  it('returns empty array when storage key is missing', async () => {
    (
      vi.mocked(chrome.storage.local.get) as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});

    const result = await getBookmarks();

    expect(result).toEqual([]);
  });

  it('returns empty array when stored value is not an array', async () => {
    (
      vi.mocked(chrome.storage.local.get) as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      [BOOKMARKS_STORAGE_KEY]: 'invalid',
    });

    const result = await getBookmarks();

    expect(result).toEqual([]);
  });
});
