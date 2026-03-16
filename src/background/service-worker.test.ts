import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BookmarkMessage } from '../shared/types/bookmark-message';
import type { BookmarkResponse } from '../shared/types/bookmark-response';
import { handleMessage } from './utils/handle-message.util';

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

vi.mock('./utils/handle-message.util', () => ({
  handleMessage: vi.fn(),
}));

describe('service worker', () => {
  let onInstalledListener: (() => void) | undefined;
  let onMessageListener:
    | ((
        message: BookmarkMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: BookmarkResponse<unknown>) => void,
      ) => boolean)
    | undefined;

  let setPanelBehaviorMock: ReturnType<typeof vi.fn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    onInstalledListener = undefined;
    onMessageListener = undefined;

    setPanelBehaviorMock = vi.fn();

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('chrome', {
      runtime: {
        onInstalled: {
          addListener: vi.fn((listener: () => void) => {
            onInstalledListener = listener;
          }),
        },
        onMessage: {
          addListener: vi.fn(
            (
              listener: (
                message: BookmarkMessage,
                sender: chrome.runtime.MessageSender,
                sendResponse: (response: BookmarkResponse<unknown>) => void,
              ) => boolean,
            ) => {
              onMessageListener = listener;
            },
          ),
        },
      },
      sidePanel: {
        setPanelBehavior: setPanelBehaviorMock,
      },
    });
  });

  it('registers onInstalled and onMessage listeners on import', async () => {
    await import('./service-worker');

    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);
    expect(onInstalledListener).toBeTypeOf('function');
    expect(onMessageListener).toBeTypeOf('function');
  });

  it('logs installation and sets side panel behavior on install', async () => {
    setPanelBehaviorMock.mockResolvedValue(undefined);

    await import('./service-worker');

    onInstalledListener?.();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[bookmark-extension] service worker installed',
    );
    expect(setPanelBehaviorMock).toHaveBeenCalledWith({
      openPanelOnActionClick: true,
    });

    await Promise.resolve();
  });

  it('logs an error when setPanelBehavior rejects', async () => {
    const error = new Error('failed to configure');
    setPanelBehaviorMock.mockRejectedValue(error);

    await import('./service-worker');

    onInstalledListener?.();

    await Promise.resolve();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[bookmark-extension] failed to set side panel behavior',
      error,
    );
  });

  it('handles runtime messages and sends success response', async () => {
    const response = {
      ok: true,
      data: { id: '1' },
    } satisfies BookmarkResponse<{ id: string }>;

    vi.mocked(handleMessage).mockResolvedValue(response);

    await import('./service-worker');

    const sendResponse = vi.fn();
    const message = { type: 'GET_BOOKMARKS' } as BookmarkMessage;

    const result = onMessageListener?.(
      message,
      {} as chrome.runtime.MessageSender,
      sendResponse,
    );

    expect(result).toBe(true);

    await Promise.resolve();

    expect(handleMessage).toHaveBeenCalledWith(message);
    expect(sendResponse).toHaveBeenCalledWith(response);
  });

  it('handles runtime message errors and sends error response', async () => {
    const error = new Error('Boom');

    vi.mocked(handleMessage).mockRejectedValue(error);

    await import('./service-worker');

    const sendResponse = vi.fn();
    const message = { type: 'GET_BOOKMARKS' } as BookmarkMessage;

    const result = onMessageListener?.(
      message,
      {} as chrome.runtime.MessageSender,
      sendResponse,
    );

    expect(result).toBe(true);

    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[bookmark-extension] unhandled message error',
      error,
    );

    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: 'Boom',
    });
  });

  it('handles non-Error thrown values', async () => {
    vi.mocked(handleMessage).mockRejectedValue('Unexpected failure');

    await import('./service-worker');

    const sendResponse = vi.fn();
    const message = { type: 'GET_BOOKMARKS' } as BookmarkMessage;

    const result = onMessageListener?.(
      message,
      {} as chrome.runtime.MessageSender,
      sendResponse,
    );

    expect(result).toBe(true);

    await flushPromises();

    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: 'Unknown error',
    });
  });

  it('does not call setPanelBehavior when sidePanel API is unavailable', async () => {
    vi.stubGlobal('chrome', {
      runtime: {
        onInstalled: {
          addListener: vi.fn((listener: () => void) => {
            onInstalledListener = listener;
          }),
        },
        onMessage: {
          addListener: vi.fn(
            (
              listener: (
                message: BookmarkMessage,
                sender: chrome.runtime.MessageSender,
                sendResponse: (response: BookmarkResponse<unknown>) => void,
              ) => boolean,
            ) => {
              onMessageListener = listener;
            },
          ),
        },
      },
      sidePanel: undefined,
    });

    await import('./service-worker');

    onInstalledListener?.();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[bookmark-extension] service worker installed',
    );
  });
});
