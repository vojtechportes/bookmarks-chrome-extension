import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openBookmarkUrl } from './open-bookmark-url';
import { getActiveTab } from './get-active-tab';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { INVALID_BOOKMARK_URL } from '../../shared/constants/error-messages';

vi.mock('./get-active-tab', () => ({
  getActiveTab: vi.fn(),
}));

vi.mock('../utils/is-bookmarkable-url.util', () => ({
  isBookmarkableUrl: vi.fn(),
}));

vi.stubGlobal('chrome', {
  tabs: {
    create: vi.fn(),
    update: vi.fn(),
  },
});

describe('openBookmarkUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when url is not bookmarkable', async () => {
    vi.mocked(isBookmarkableUrl).mockReturnValue(false);

    await expect(openBookmarkUrl('Invalid URL', false)).rejects.toThrow(
      INVALID_BOOKMARK_URL,
    );

    expect(chrome.tabs.create).not.toHaveBeenCalled();
    expect(chrome.tabs.update).not.toHaveBeenCalled();
    expect(getActiveTab).not.toHaveBeenCalled();
  });

  it('creates a new tab when newTab is true', async () => {
    vi.mocked(isBookmarkableUrl).mockReturnValue(true);

    await openBookmarkUrl('https://example.com', true);

    expect(chrome.tabs.create).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: 'https://example.com',
    });
    expect(chrome.tabs.update).not.toHaveBeenCalled();
    expect(getActiveTab).not.toHaveBeenCalled();
  });

  it('updates the active tab when newTab is false and active tab has id', async () => {
    vi.mocked(isBookmarkableUrl).mockReturnValue(true);
    vi.mocked(getActiveTab).mockResolvedValue({
      id: 123,
    } as chrome.tabs.Tab);

    await openBookmarkUrl('https://example.com', false);

    expect(getActiveTab).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(123, {
      url: 'https://example.com',
    });
    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });

  it('creates a new tab when active tab has no id', async () => {
    vi.mocked(isBookmarkableUrl).mockReturnValue(true);
    vi.mocked(getActiveTab).mockResolvedValue({} as chrome.tabs.Tab);

    await openBookmarkUrl('https://example.com', false);

    expect(getActiveTab).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.create).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: 'https://example.com',
    });
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });
});
