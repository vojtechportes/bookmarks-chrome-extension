import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';
import { useBookmarks } from './use-bookmarks';
import { BookmarksContext } from '../components/bookmarks-context';

const mockContextValue = {
  hasBookmarks: false,
  isLoadingHasBookmarks: false,
  reloadHasBookmarks: vi.fn(),
};

const BookmarksWrapper = ({ children }: PropsWithChildren) => (
  <BookmarksContext.Provider value={mockContextValue}>
    {children}
  </BookmarksContext.Provider>
);

describe('useBookmarks', () => {
  it('returns context value when within context', () => {
    const { result } = renderHook(() => useBookmarks(), {
      wrapper: BookmarksWrapper,
    });

    expect(result.current.hasBookmarks).toBe(false);
    expect(result.current.isLoadingHasBookmarks).toBe(false);
    expect(result.current.reloadHasBookmarks).toBe(
      mockContextValue.reloadHasBookmarks,
    );
  });

  it('throws when outside context', () => {
    expect(() => renderHook(() => useBookmarks())).toThrow(Error);
  });
});
