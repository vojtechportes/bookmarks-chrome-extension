import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useStorage } from './use-storage';
import { storageApi } from '../api/storage-api/storage-api';
import { BOOKMARKS_VIEW_TYPE_STORAGE_KEY } from '../../shared/constants/storage';

vi.mock('../api/storage-api/storage-api', () => ({
  storageApi: {
    get: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn(),
  },
}));

describe('useStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(storageApi.get).mockResolvedValue(undefined);
    vi.mocked(storageApi.set).mockResolvedValue(undefined);
    vi.mocked(storageApi.subscribe).mockReturnValue(vi.fn());
  });

  it('loads default bookmarks view type when nothing is stored', async () => {
    const { result } = renderHook(() =>
      useStorage(BOOKMARKS_VIEW_TYPE_STORAGE_KEY, 'list'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe('list');
    expect(storageApi.get).toHaveBeenCalledWith(
      BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
    );
  });

  it('loads stored bookmarks view type', async () => {
    vi.mocked(storageApi.get).mockResolvedValue('tiles');

    const { result } = renderHook(() =>
      useStorage(BOOKMARKS_VIEW_TYPE_STORAGE_KEY, 'list'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe('tiles');
  });

  it('stores updated bookmarks view type', async () => {
    const { result } = renderHook(() =>
      useStorage(BOOKMARKS_VIEW_TYPE_STORAGE_KEY, 'list'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setValue('tiles');
    });

    expect(result.current.value).toBe('tiles');
    expect(storageApi.set).toHaveBeenCalledWith(
      BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
      'tiles',
    );
  });
});
