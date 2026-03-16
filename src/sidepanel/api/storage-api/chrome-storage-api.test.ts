import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChromeStorageApi } from './chrome-storage-api';
import { BOOKMARKS_VIEW_TYPE_STORAGE_KEY } from '../../../shared/constants/storage';

describe('ChromeStorageApi', () => {
  const getMock = vi.fn();
  const setMock = vi.fn();
  const addListenerMock = vi.fn();
  const removeListenerMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(globalThis, 'chrome', {
      value: {
        storage: {
          local: {
            get: getMock,
            set: setMock,
          },
          onChanged: {
            addListener: addListenerMock,
            removeListener: removeListenerMock,
          },
        },
      },
      configurable: true,
    });
  });

  it('gets value from chrome storage', async () => {
    getMock.mockResolvedValue({ [BOOKMARKS_VIEW_TYPE_STORAGE_KEY]: 'list' });

    const api = new ChromeStorageApi();
    const result = await api.get<string>(BOOKMARKS_VIEW_TYPE_STORAGE_KEY);

    expect(getMock).toHaveBeenCalledWith([BOOKMARKS_VIEW_TYPE_STORAGE_KEY]);
    expect(result).toBe('list');
  });

  it('sets value to chrome storage', async () => {
    setMock.mockResolvedValue(undefined);

    const api = new ChromeStorageApi();
    await api.set(BOOKMARKS_VIEW_TYPE_STORAGE_KEY, 'list');

    expect(setMock).toHaveBeenCalledWith({
      [BOOKMARKS_VIEW_TYPE_STORAGE_KEY]: 'list',
    });
  });

  it('subscribes to storage changes and calls callback for matching local key', () => {
    const api = new ChromeStorageApi();
    const callback = vi.fn();

    api.subscribe(BOOKMARKS_VIEW_TYPE_STORAGE_KEY, callback);

    expect(addListenerMock).toHaveBeenCalledTimes(1);

    const listener = addListenerMock.mock.calls[0][0];

    listener(
      {
        [BOOKMARKS_VIEW_TYPE_STORAGE_KEY]: {
          oldValue: 'tiles',
          newValue: 'list',
        },
      },
      'local',
    );

    expect(callback).toHaveBeenCalledWith({
      oldValue: 'tiles',
      newValue: 'list',
    });
  });

  it('returns unsubscribe function', () => {
    const api = new ChromeStorageApi();
    const callback = vi.fn();

    const unsubscribe = api.subscribe(
      BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
      callback,
    );

    const listener = addListenerMock.mock.calls[0][0];

    unsubscribe();

    expect(removeListenerMock).toHaveBeenCalledWith(listener);
  });
});
