import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActiveTab } from './get-active-tab';
import { NO_ACTIVE_BOOKMARK_FOUND } from '../../shared/constants/error-messages';

describe('getActiveTab', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the active tab', async () => {
    const tab = {
      id: 123,
      active: true,
      title: 'Example',
      url: 'https://example.com',
    } as chrome.tabs.Tab;

    (
      vi.spyOn(chrome.tabs, 'query') as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue([tab]);

    await expect(getActiveTab()).resolves.toEqual(tab);
    expect(chrome.tabs.query).toHaveBeenCalledWith({
      active: true,
      currentWindow: true,
    });
  });

  it('throws when there is no active tab', async () => {
    (
      vi.spyOn(chrome.tabs, 'query') as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue([]);

    await expect(getActiveTab()).rejects.toThrow(NO_ACTIVE_BOOKMARK_FOUND);
    expect(chrome.tabs.query).toHaveBeenCalledWith({
      active: true,
      currentWindow: true,
    });
  });
});
