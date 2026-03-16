import { describe, it, expect, vi } from 'vitest';
import { deleteBookmark } from './delete-bookmark';
import { updateBookmarks } from '../utils/update-bookmarks.util';
import type { BookmarkItem } from '../../shared/types/bookmark-item';
import { BOOKMARK_NOT_FOUND } from '../../shared/constants/error-messages';

vi.mock('../utils/update-bookmarks.util', () => ({
  updateBookmarks: vi.fn(),
}));

describe('deleteBookmark', () => {
  it('removes bookmark when it exists', async () => {
    const mockUpdate = vi.mocked(updateBookmarks);

    let updater: (bookmarks: BookmarkItem[]) => BookmarkItem[];

    mockUpdate.mockImplementation(async (fn) => {
      updater = fn;
    });

    await deleteBookmark('1');

    const result = updater!([
      { id: '1', title: 'A' } as BookmarkItem,
      { id: '2', title: 'B' } as BookmarkItem,
    ]);

    expect(result).toEqual([{ id: '2', title: 'B' }]);
  });

  it('throws error when bookmark does not exist', async () => {
    const mockUpdate = vi.mocked(updateBookmarks);

    let updater: (bookmarks: BookmarkItem[]) => BookmarkItem[];

    mockUpdate.mockImplementation(async (fn) => {
      updater = fn;
    });

    await deleteBookmark('1');

    expect(() => updater([{ id: '2', title: 'B' } as BookmarkItem])).toThrow(
      BOOKMARK_NOT_FOUND,
    );
  });
});
