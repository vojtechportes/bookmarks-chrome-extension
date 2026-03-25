/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BookmarksProvider } from './bookmarks-provider';
import { BookmarksContext } from './components/bookmarks-context';
import { hasBookmarks } from '../../../shared/database/api/bookmarks/has-bookmarks';
import { BROADCAST_EVENT_NAME } from '../../../shared/broadcast/constants';

const { emitBookmarksMessage } = vi.hoisted(() => {
  return {
    emitBookmarksMessage: vi.fn(),
  };
});

vi.mock('../../../shared/database/api/bookmarks/has-bookmarks', () => ({
  hasBookmarks: vi.fn(),
}));

vi.mock('../../../shared/broadcast/bookmarks-events', () => {
  const listeners = new Set<(event: any) => void>();

  emitBookmarksMessage.mockImplementation((data: unknown) => {
    listeners.forEach((fn) => fn({ data }));
  });

  return {
    bookmarksChannel: {
      addEventListener: (_: string, fn: (event: any) => void) =>
        listeners.add(fn),
      removeEventListener: (_: string, fn: (event: any) => void) =>
        listeners.delete(fn),
    },
  };
});

const mockedHasBookmarks = vi.mocked(hasBookmarks);

const TestConsumer = () => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error('Context missing');
  }

  return (
    <>
      <div data-testid="has-bookmarks">{String(context.hasBookmarks)}</div>
      <div data-testid="is-loading">
        {String(context.isLoadingHasBookmarks)}
      </div>
    </>
  );
};

describe('BookmarksProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls hasBookmarks on mount and provides value', async () => {
    mockedHasBookmarks.mockResolvedValue(true);

    render(
      <BookmarksProvider>
        <TestConsumer />
      </BookmarksProvider>,
    );

    expect(mockedHasBookmarks).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('has-bookmarks')).toHaveTextContent('true');
    });

    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('reloads when broadcast event is received', async () => {
    mockedHasBookmarks.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    render(
      <BookmarksProvider>
        <TestConsumer />
      </BookmarksProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('has-bookmarks')).toHaveTextContent('false');
    });

    emitBookmarksMessage({ type: BROADCAST_EVENT_NAME });

    await waitFor(() => {
      expect(screen.getByTestId('has-bookmarks')).toHaveTextContent('true');
    });

    expect(mockedHasBookmarks).toHaveBeenCalledTimes(2);
  });
});
