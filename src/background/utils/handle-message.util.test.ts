import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleMessage } from './handle-message.util';
import { bookmarksChanged } from '../api/bookmarks-changed';
import { openBookmarkUrl } from '../api/open-bookmark-url';
import { saveActiveTabBookmark } from '../api/save-active-tab-bookmark';
import { summarizeActiveTab } from '../api/summarize-active-tab';
import { summarizeText } from '../api/summarize-text.util';
import { SUMMARIZER_OPTIONS } from '../../shared/constants/summarizer';
import type { SummarizeTextMessage } from '../../shared/types/summarize-text-message';
import { activeTabResponseMock } from '../../__mocks__/active-tab-response.mock';
import type { SummarizeActiveTabMessage } from '../../shared/types/summarize-active-tab-message';

vi.mock('../api/bookmarks-changed', () => ({
  bookmarksChanged: vi.fn(),
}));

vi.mock('../api/open-bookmark-url', () => ({
  openBookmarkUrl: vi.fn(),
}));

vi.mock('../api/save-active-tab-bookmark', () => ({
  saveActiveTabBookmark: vi.fn(),
}));

vi.mock('../api/summarize-active-tab', () => ({
  summarizeActiveTab: vi.fn(),
}));

vi.mock('../api/summarize-text.util', () => ({
  summarizeText: vi.fn(),
}));

describe('handleMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles SAVE_ACTIVE_TAB', async () => {
    vi.mocked(saveActiveTabBookmark).mockResolvedValue(
      activeTabResponseMock()?.data,
    );

    const result = await handleMessage({
      type: 'SAVE_ACTIVE_TAB',
    });

    expect(saveActiveTabBookmark).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, data: activeTabResponseMock()?.data });
  });

  it('handles OPEN_BOOKMARK with explicit newTab', async () => {
    vi.mocked(openBookmarkUrl).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'OPEN_BOOKMARK',
      payload: { url: 'https://test.com', newTab: false },
    });

    expect(openBookmarkUrl).toHaveBeenCalledWith('https://test.com', false);
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it('handles OPEN_BOOKMARK with default newTab=true', async () => {
    vi.mocked(openBookmarkUrl).mockResolvedValue(undefined);

    await handleMessage({
      type: 'OPEN_BOOKMARK',
      payload: { url: 'https://test.com' },
    });

    expect(openBookmarkUrl).toHaveBeenCalledWith('https://test.com', true);
  });

  it('handles BOOKMARKS_CHANGED', async () => {
    vi.mocked(bookmarksChanged).mockResolvedValue(undefined);

    const result = await handleMessage({
      type: 'BOOKMARKS_CHANGED',
    });

    expect(bookmarksChanged).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it('handles SUMMARIZE_TEXT', async () => {
    const payload: SummarizeTextMessage['payload'] = {
      input: 'test',
      options: SUMMARIZER_OPTIONS,
    };
    const summary = 'summary';

    vi.mocked(summarizeText).mockResolvedValue(summary);

    const result = await handleMessage({
      type: 'SUMMARIZE_TEXT',
      payload,
    });

    expect(summarizeText).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ ok: true, data: summary });
  });

  it('handles SUMMARIZE_ACTIVE_TAB', async () => {
    const payload: SummarizeActiveTabMessage['payload'] = {
      options: SUMMARIZER_OPTIONS,
    };
    const summary = 'summary';

    vi.mocked(summarizeActiveTab).mockResolvedValue(summary);

    const result = await handleMessage({
      type: 'SUMMARIZE_ACTIVE_TAB',
      payload,
    });

    expect(summarizeActiveTab).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ ok: true, data: summary });
  });
});
