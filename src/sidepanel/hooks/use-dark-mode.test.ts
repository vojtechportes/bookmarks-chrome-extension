import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './use-dark-mode';
import { getIsDark } from '../utils/get-is-dark.util';

vi.mock('../utils/get-is-dark.util', () => ({
  getIsDark: vi.fn(),
}));

describe('useDarkMode', () => {
  let listeners: ((event: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    listeners = [];

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: (
          _: string,
          cb: (event: MediaQueryListEvent) => void,
        ) => {
          listeners.push(cb);
        },
        removeEventListener: vi.fn(),
      })),
    );
  });

  it('returns initial value from getIsDark()', () => {
    vi.mocked(getIsDark).mockReturnValue(true);

    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(true);
    expect(getIsDark).toHaveBeenCalled();
  });

  it('updates when media query changes', () => {
    vi.mocked(getIsDark).mockReturnValue(false);

    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(false);

    act(() => {
      listeners[0]({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it('registers matchMedia listener', () => {
    vi.mocked(getIsDark).mockReturnValue(false);

    renderHook(() => useDarkMode());

    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)',
    );
    expect(listeners.length).toBe(1);
  });
});
