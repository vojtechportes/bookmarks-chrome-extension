import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pinBookmark } from './pin-bookmark';
import { updateBookmarks } from '../utils/update-bookmarks.util';
import { BOOKMARK_NOT_FOUND } from '../../shared/constants/error-messages';
import type { BookmarkItem } from '../../shared/types/bookmark-item';

vi.mock('../utils/update-bookmarks.util', () => ({
  updateBookmarks: vi.fn(),
}));

describe('pinBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pins bookmark when it exists', async () => {
    let updater!: Parameters<typeof updateBookmarks>[0];

    vi.mocked(updateBookmarks).mockImplementation(async (fn) => {
      updater = fn;
    });

    await pinBookmark('1');

    const input: BookmarkItem[] = [
      { id: '1', pinned: false } as BookmarkItem,
      { id: '2', pinned: false } as BookmarkItem,
    ];

    const result = updater(input);

    expect(result).toEqual([
      { id: '1', pinned: true },
      { id: '2', pinned: false },
    ]);
  });

  it('throws error when bookmark does not exist', async () => {
    let updater!: Parameters<typeof updateBookmarks>[0];

    vi.mocked(updateBookmarks).mockImplementation(async (fn) => {
      updater = fn;
    });

    await pinBookmark('1');

    const input: BookmarkItem[] = [{ id: '2' } as BookmarkItem];

    expect(() => updater(input)).toThrow(BOOKMARK_NOT_FOUND);
  });
});
