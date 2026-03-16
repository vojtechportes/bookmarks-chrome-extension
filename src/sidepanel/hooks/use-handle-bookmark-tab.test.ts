import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHandleBookmarkTab } from './use-handle-bookmark-tab';
import { runtimeApi } from '../api/runtime-api/runtime-api';
import {
  BOOKMARK_ALREADY_EXISTS,
  TAB_CANNOT_BE_BOOKMARKED,
} from '../../shared/constants/error-messages';

const success = vi.fn();
const error = vi.fn();
const info = vi.fn();
const t = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t }),
}));

vi.mock('../components/alert-provider/hooks/use-alert', () => ({
  useAlert: () => ({ success, error, info }),
}));

vi.mock('../api/runtime-api/runtime-api', () => ({
  runtimeApi: {
    saveActiveTab: vi.fn(),
  },
}));

describe('useHandleBookmarkTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles success', async () => {
    vi.mocked(runtimeApi.saveActiveTab).mockResolvedValue({
      ok: true,
      data: {
        id: '1',
        title: 'test',
        addedAt: 'test',
        description: 'test',
        url: 'http://example.com',
      },
    });

    const { result } = renderHook(() => useHandleBookmarkTab());

    await act(async () => {
      await result.current.handleBookmarkTab();
    });

    expect(success).toHaveBeenCalledWith('success-messages.bookmark-added');
  });

  it('handles already existing bookmark', async () => {
    vi.mocked(runtimeApi.saveActiveTab).mockResolvedValue({
      ok: false,
      error: BOOKMARK_ALREADY_EXISTS,
    });

    const { result } = renderHook(() => useHandleBookmarkTab());

    await act(async () => {
      await result.current.handleBookmarkTab();
    });

    expect(info).toHaveBeenCalledWith(
      `info-messages.${BOOKMARK_ALREADY_EXISTS}`,
    );
  });

  it('handles generic error', async () => {
    vi.mocked(runtimeApi.saveActiveTab).mockResolvedValue({
      ok: false,
      error: TAB_CANNOT_BE_BOOKMARKED,
    });

    const { result } = renderHook(() => useHandleBookmarkTab());

    await act(async () => {
      await result.current.handleBookmarkTab();
    });

    expect(error).toHaveBeenCalledWith(
      `error-messages.${TAB_CANNOT_BE_BOOKMARKED}`,
    );
  });
});
