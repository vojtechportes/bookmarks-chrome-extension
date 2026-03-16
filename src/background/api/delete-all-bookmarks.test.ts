import { describe, it, expect, vi } from 'vitest';
import { deleteAllBookmarks } from './delete-all-bookmarks';
import { setBookmarks } from './set-bookmarks';

vi.mock('./set-bookmarks', () => ({
  setBookmarks: vi.fn(),
}));

describe('deleteAllBookmarks', () => {
  it('should clear all bookmarks', async () => {
    await deleteAllBookmarks();

    expect(setBookmarks).toHaveBeenCalledTimes(1);
    expect(setBookmarks).toHaveBeenCalledWith([]);
  });
});
