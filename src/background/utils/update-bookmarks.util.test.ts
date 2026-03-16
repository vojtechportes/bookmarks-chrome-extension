import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateBookmarks } from './update-bookmarks.util';
import { getBookmarks } from '../api/get-bookmarks';
import { setBookmarks } from '../api/set-bookmarks';

vi.mock('../api/get-bookmarks', () => ({
  getBookmarks: vi.fn(),
}));

vi.mock('../api/set-bookmarks', () => ({
  setBookmarks: vi.fn(),
}));

describe('updateBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets bookmarks, applies updater, and saves updated bookmarks', async () => {
    const bookmarks = [
      { id: '1', title: 'One', pinned: false },
      { id: '2', title: 'Two', pinned: false },
    ];

    const updatedBookmarks = [
      { id: '1', title: 'One', pinned: true },
      { id: '2', title: 'Two', pinned: false },
    ];

    vi.mocked(getBookmarks).mockResolvedValue(bookmarks as never);
    vi.mocked(setBookmarks).mockResolvedValue(undefined);

    const updater = vi.fn().mockReturnValue(updatedBookmarks);

    await updateBookmarks(updater);

    expect(getBookmarks).toHaveBeenCalledTimes(1);
    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater).toHaveBeenCalledWith(bookmarks);
    expect(setBookmarks).toHaveBeenCalledTimes(1);
    expect(setBookmarks).toHaveBeenCalledWith(updatedBookmarks);
  });
});
