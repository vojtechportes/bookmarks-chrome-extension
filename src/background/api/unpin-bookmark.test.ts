import { beforeEach, describe, expect, it, vi } from 'vitest';
import { unpinBookmark } from './unpin-bookmark';
import { updateBookmarks } from '../utils/update-bookmarks.util';
import { BOOKMARK_NOT_FOUND } from '../../shared/constants/error-messages';
import type { BookmarkItem } from '../../shared/types/bookmark-item';

vi.mock('../utils/update-bookmarks.util', () => ({
  updateBookmarks: vi.fn(),
}));

describe('unpinBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls updateBookmarks', async () => {
    vi.mocked(updateBookmarks).mockResolvedValue(undefined);

    await unpinBookmark('1');

    expect(updateBookmarks).toHaveBeenCalledTimes(1);
  });

  it('unpins the correct bookmark', async () => {
    vi.mocked(updateBookmarks).mockImplementation(async (updater) => {
      const bookmarks: BookmarkItem[] = [
        { id: '1', pinned: true } as BookmarkItem,
        { id: '2', pinned: true } as BookmarkItem,
      ];

      const updated = updater(bookmarks);

      expect(updated).toEqual([
        { id: '1', pinned: false },
        { id: '2', pinned: true },
      ]);

      return undefined;
    });

    await unpinBookmark('1');
  });

  it('throws when bookmark does not exist', async () => {
    vi.mocked(updateBookmarks).mockImplementation(async (updater) => {
      const bookmarks: BookmarkItem[] = [
        { id: '1', pinned: true } as BookmarkItem,
      ];

      expect(() => updater(bookmarks)).toThrowError(
        new Error(BOOKMARK_NOT_FOUND),
      );

      return undefined;
    });

    await unpinBookmark('2');
  });
});
