import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIsDark } from './get-is-dark.util';

describe('getIsDark', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when dark mode is preferred', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
      }),
    );

    expect(getIsDark()).toBe(true);

    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)',
    );
  });

  it('returns false when dark mode is not preferred', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
      }),
    );

    expect(getIsDark()).toBe(false);
  });
});
