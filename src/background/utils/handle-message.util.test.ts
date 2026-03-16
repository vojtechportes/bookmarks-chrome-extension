import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../shared/constants/error-messages';
import { handleMessage } from './handle-message.util';
import { deleteAllBookmarks } from '../api/delete-all-bookmarks';
import { deleteBookmark } from '../api/delete-bookmark';
import { getBookmarks } from '../api/get-bookmarks';
import { openBookmarkUrl } from '../api/open-bookmark-url';
import { pinBookmark } from '../api/pin-bookmark';
import { saveActiveTabBookmark } from '../api/save-active-tab-bookmark';
import { unpinBookmark } from '../api/unpin-bookmark';

vi.mock('../api/delete-all-bookmarks', () => ({
  deleteAllBookmarks: vi.fn(),
}));

vi.mock('../api/delete-bookmark', () => ({
  deleteBookmark: vi.fn(),
}));

vi.mock('../api/get-bookmarks', () => ({
  getBookmarks: vi.fn(),
}));

vi.mock('../api/open-bookmark-url', () => ({
  openBookmarkUrl: vi.fn(),
}));

vi.mock('../api/pin-bookmark', () => ({
  pinBookmark: vi.fn(),
}));

vi.mock('../api/save-active-tab-bookmark', () => ({
  saveActiveTabBookmark: vi.fn(),
}));

vi.mock('../api/unpin-bookmark', () => ({
  unpinBookmark: vi.fn(),
}));

describe('handleMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns bookmarks for GET_BOOKMARKS', async () => {
    const bookmarks = [{ id: '1', title: 'Example' }];

    vi.mocked(getBookmarks).mockResolvedValue(bookmarks as never);

    const result = await handleMessage({
      type: 'GET_BOOKMARKS',
    });

    expect(getBookmarks).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      data: bookmarks,
    });
  });

  it('returns saved bookmark for SAVE_ACTIVE_TAB', async () => {
    const bookmark = { id: '1', title: 'Saved tab' };

    vi.mocked(saveActiveTabBookmark).mockResolvedValue(bookmark as never);

    const result = await handleMessage({
      type: 'SAVE_ACTIVE_TAB',
    });

    expect(saveActiveTabBookmark).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      data: bookmark,
    });
  });

  it('calls pinBookmark for PIN_BOOKMARK', async () => {
    vi.mocked(pinBookmark).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'PIN_BOOKMARK',
      payload: { id: '1' },
    });

    expect(pinBookmark).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('calls unpinBookmark for UNPIN_BOOKMARK', async () => {
    vi.mocked(unpinBookmark).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'UNPIN_BOOKMARK',
      payload: { id: '1' },
    });

    expect(unpinBookmark).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('calls deleteBookmark for DELETE_BOOKMARK', async () => {
    vi.mocked(deleteBookmark).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'DELETE_BOOKMARK',
      payload: { id: '1' },
    });

    expect(deleteBookmark).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('calls deleteAllBookmarks for DELETE_ALL_BOOKMARKS', async () => {
    vi.mocked(deleteAllBookmarks).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'DELETE_ALL_BOOKMARKS',
    });

    expect(deleteAllBookmarks).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('calls openBookmarkUrl with explicit newTab value', async () => {
    vi.mocked(openBookmarkUrl).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'OPEN_BOOKMARK',
      payload: {
        url: 'https://example.com',
        newTab: false,
      },
    });

    expect(openBookmarkUrl).toHaveBeenCalledWith('https://example.com', false);
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('defaults newTab to true for OPEN_BOOKMARK', async () => {
    vi.mocked(openBookmarkUrl).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'OPEN_BOOKMARK',
      payload: {
        url: 'https://example.com',
      },
    });

    expect(openBookmarkUrl).toHaveBeenCalledWith('https://example.com', true);
    expect(result).toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('returns error for unsupported message type', async () => {
    const result = await handleMessage({
      type: 'UNKNOWN_MESSAGE_TYPE',
    } as never);

    expect(result).toEqual({
      ok: false,
      error: UNSUPPORTED_MESSAGE_TYPE,
    });
  });
});
