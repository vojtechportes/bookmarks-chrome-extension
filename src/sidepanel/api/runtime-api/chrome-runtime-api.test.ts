import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChromeRuntimeApi } from './chrome-runtime-api';

describe('ChromeRuntimeApi', () => {
  const sendMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(globalThis, 'chrome', {
      value: {
        runtime: {
          sendMessage,
        },
      },
      configurable: true,
    });
  });

  it('saveActiveTab sends correct message', async () => {
    sendMessage.mockResolvedValue({ ok: true });

    const api = new ChromeRuntimeApi();
    const result = await api.saveActiveTab();

    expect(sendMessage).toHaveBeenCalledWith({
      type: 'SAVE_ACTIVE_TAB',
    });

    expect(result).toEqual({ ok: true });
  });

  it('pinBookmark sends id payload', async () => {
    sendMessage.mockResolvedValue({ ok: true });

    const api = new ChromeRuntimeApi();
    await api.pinBookmark('123');

    expect(sendMessage).toHaveBeenCalledWith({
      type: 'PIN_BOOKMARK',
      payload: { id: '123' },
    });
  });

  it('deleteAllBookmarks sends correct message', async () => {
    sendMessage.mockResolvedValue({ ok: true });

    const api = new ChromeRuntimeApi();
    await api.deleteAllBookmarks();

    expect(sendMessage).toHaveBeenCalledWith({
      type: 'DELETE_ALL_BOOKMARKS',
    });
  });
});
