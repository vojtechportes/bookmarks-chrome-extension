import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHandleDeleteAllBookmarks } from './use-handle-delete-all-bookmarks';
import { runtimeApi } from '../../../api/runtime-api/runtime-api';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../shared/constants/error-messages';

const errorMock = vi.fn();
const successMock = vi.fn();
const tMock = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));

vi.mock('../../../components/alert-provider/hooks/use-alert', () => ({
  useAlert: () => ({
    error: errorMock,
    success: successMock,
  }),
}));

vi.mock('../../../api/runtime-api/runtime-api', () => ({
  runtimeApi: {
    deleteAllBookmarks: vi.fn(),
  },
}));

describe('useHandleDeleteAllBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles success', async () => {
    vi.mocked(runtimeApi.deleteAllBookmarks).mockResolvedValue({
      ok: true,
      data: undefined,
    });

    const { result } = renderHook(() => useHandleDeleteAllBookmarks());

    expect(result.current.isDeleting).toBe(false);

    await act(async () => {
      await result.current.handleDeleteAllBookmarks();
    });

    expect(runtimeApi.deleteAllBookmarks).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalledWith(
      'success-messages.bookmarks-deleted',
    );
    expect(errorMock).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });

  it('handles error response', async () => {
    vi.mocked(runtimeApi.deleteAllBookmarks).mockResolvedValue({
      ok: false,
      error: 'SOME_ERROR',
    });

    const { result } = renderHook(() => useHandleDeleteAllBookmarks());

    await act(async () => {
      await result.current.handleDeleteAllBookmarks();
    });

    expect(errorMock).toHaveBeenCalledWith('error-messages.SOME_ERROR');
    expect(successMock).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });

  it('handles thrown error', async () => {
    vi.mocked(runtimeApi.deleteAllBookmarks).mockRejectedValue(
      new Error('fail'),
    );

    const { result } = renderHook(() => useHandleDeleteAllBookmarks());

    await act(async () => {
      await result.current.handleDeleteAllBookmarks();
    });

    expect(errorMock).toHaveBeenCalledWith(
      `error-messages.${UNSUPPORTED_MESSAGE_TYPE}`,
    );
    expect(successMock).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
