import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACTIVE_TAB_ID_MISSING,
  BOOKMARK_ALREADY_EXISTS,
  TAB_CANNOT_BE_BOOKMARKED,
} from '../../shared/constants/error-messages';
import { saveActiveTabBookmark } from './save-active-tab-bookmark';
import { getActiveTab } from './get-active-tab';
import { getBookmarks } from './get-bookmarks';
import { setBookmarks } from './set-bookmarks';
import { extractPageData } from '../utils/extract-page-data.util';
import { getIconUrl } from '../utils/get-icon-url.util';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { saveIconAsset } from '../utils/save-icon-asset.util';
import { saveScreenshotAsset } from '../utils/save-screenshot-asset.util';
import type { BookmarkItem } from '../../shared/types/bookmark-item';

vi.mock('./get-active-tab', () => ({
  getActiveTab: vi.fn(),
}));

vi.mock('./get-bookmarks', () => ({
  getBookmarks: vi.fn(),
}));

vi.mock('./set-bookmarks', () => ({
  setBookmarks: vi.fn(),
}));

vi.mock('../utils/extract-page-data.util', () => ({
  extractPageData: vi.fn(),
}));

vi.mock('../utils/get-icon-url.util', () => ({
  getIconUrl: vi.fn(),
}));

vi.mock('../utils/is-bookmarkable-url.util', () => ({
  isBookmarkableUrl: vi.fn(),
}));

vi.mock('../utils/save-icon-asset.util', () => ({
  saveIconAsset: vi.fn(),
}));

vi.mock('../utils/save-screenshot-asset.util', () => ({
  saveScreenshotAsset: vi.fn(),
}));

describe('saveActiveTabBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'bookmark-123'),
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-16T10:00:00.000Z'));

    vi.mocked(getBookmarks).mockResolvedValue([]);
    vi.mocked(isBookmarkableUrl).mockReturnValue(true);
    vi.mocked(getIconUrl).mockReturnValue(undefined);
    vi.mocked(saveScreenshotAsset).mockResolvedValue(undefined);
    vi.mocked(saveIconAsset).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when active tab id is missing', async () => {
    vi.mocked(getActiveTab).mockResolvedValue({
      url: 'https://example.com',
      title: 'Example',
    } as chrome.tabs.Tab);

    await expect(saveActiveTabBookmark()).rejects.toThrow(
      ACTIVE_TAB_ID_MISSING,
    );

    expect(extractPageData).not.toHaveBeenCalled();
    expect(setBookmarks).not.toHaveBeenCalled();
  });

  it('throws when active tab url is not bookmarkable', async () => {
    vi.mocked(getActiveTab).mockResolvedValue({
      id: 1,
      url: 'chrome://extensions',
      title: 'Extensions',
    } as chrome.tabs.Tab);

    vi.mocked(isBookmarkableUrl).mockReturnValue(false);

    await expect(saveActiveTabBookmark()).rejects.toThrow(
      TAB_CANNOT_BE_BOOKMARKED,
    );

    expect(extractPageData).not.toHaveBeenCalled();
    expect(setBookmarks).not.toHaveBeenCalled();
  });

  it('throws when bookmark already exists', async () => {
    vi.mocked(getActiveTab).mockResolvedValue({
      id: 1,
      url: 'https://example.com',
      title: 'Example',
    } as chrome.tabs.Tab);

    vi.mocked(extractPageData).mockResolvedValue({
      title: 'Title',
      url: 'https://example.com',
      description: 'Description',
      icon: 'https://example.com/icon.png',
      iconDark: undefined,
      iconLight: undefined,
    });

    vi.mocked(getBookmarks).mockResolvedValue([
      {
        id: 'existing-id',
        url: 'https://example.com',
      } as BookmarkItem,
    ]);

    await expect(saveActiveTabBookmark()).rejects.toThrow(
      BOOKMARK_ALREADY_EXISTS,
    );

    expect(setBookmarks).not.toHaveBeenCalled();
  });

  it('saves bookmark successfully', async () => {
    vi.mocked(getActiveTab).mockResolvedValue({
      id: 1,
      url: 'https://example.com',
      title: 'Tab title',
    } as chrome.tabs.Tab);

    vi.mocked(extractPageData).mockResolvedValue({
      title: 'Page title',
      url: 'https://example.com',
      description: 'Description',
      icon: 'https://example.com/icon.png',
      iconDark: undefined,
      iconLight: undefined,
    });

    vi.mocked(getIconUrl)
      .mockReturnValueOnce('https://example.com/icon.png')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);

    vi.mocked(saveIconAsset).mockResolvedValue('icon-asset-1');
    vi.mocked(saveScreenshotAsset).mockResolvedValue('screenshot-asset-1');

    const result = await saveActiveTabBookmark();

    expect(saveIconAsset).toHaveBeenCalledWith(
      'bookmark-123',
      'https://example.com/icon.png',
    );
    expect(saveScreenshotAsset).toHaveBeenCalledWith('bookmark-123');

    expect(setBookmarks).toHaveBeenCalledWith([
      {
        id: 'bookmark-123',
        title: 'Page title',
        url: 'https://example.com',
        icon: 'https://example.com/icon.png',
        iconAssetId: 'icon-asset-1',
        lightIconAssetId: undefined,
        darkIconAssetId: undefined,
        screenshotAssetId: 'screenshot-asset-1',
        description: 'Description',
        addedAt: '2026-03-16T10:00:00.000Z',
        pinned: false,
      },
    ]);

    expect(result).toEqual({
      id: 'bookmark-123',
      title: 'Page title',
      url: 'https://example.com',
      icon: 'https://example.com/icon.png',
      iconAssetId: 'icon-asset-1',
      lightIconAssetId: undefined,
      darkIconAssetId: undefined,
      screenshotAssetId: 'screenshot-asset-1',
      description: 'Description',
      addedAt: '2026-03-16T10:00:00.000Z',
      pinned: false,
    });
  });

  it('continues when icon and screenshot persistence fail', async () => {
    vi.mocked(getActiveTab).mockResolvedValue({
      id: 1,
      url: 'https://example.com',
      title: 'Tab title',
    } as chrome.tabs.Tab);

    vi.mocked(extractPageData).mockResolvedValue({
      title: 'Page title',
      url: 'https://example.com',
      description: 'Description',
      icon: 'https://example.com/icon.png',
      iconDark: undefined,
      iconLight: undefined,
    });

    vi.mocked(getIconUrl)
      .mockReturnValueOnce('https://example.com/icon.png')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(saveIconAsset).mockRejectedValue(new Error('icon failed'));
    vi.mocked(saveScreenshotAsset).mockRejectedValue(
      new Error('screenshot failed'),
    );

    const result = await saveActiveTabBookmark();

    expect(result.iconAssetId).toBeUndefined();
    expect(result.screenshotAssetId).toBeUndefined();
    expect(setBookmarks).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});
