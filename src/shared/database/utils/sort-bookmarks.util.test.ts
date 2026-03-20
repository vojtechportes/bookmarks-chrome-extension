import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBookmarkItem } from '../../types/bookmark-item';
import { sortBookmarks } from './sort-bookmarks.util';
import { normalizeTitle } from './normalize-title.util';
import { activeTabResponseMock } from '../../../__mocks__/active-tab-response.mock';

vi.mock('./normalize-title.util', () => ({
  normalizeTitle: vi.fn((value: string) => value.trim().toLowerCase()),
}));

const mockedNormalizeTitle = vi.mocked(normalizeTitle);

const createBookmark = (data: Partial<IBookmarkItem> = {}): IBookmarkItem => ({
  ...activeTabResponseMock().data,
  ...data,
});

describe('sortBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array for empty input', () => {
    expect(sortBookmarks([])).toEqual([]);
  });

  it('does not mutate original array', () => {
    const bookmarks = [
      createBookmark({
        id: '1',
        title: 'B',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
      createBookmark({
        id: '2',
        title: 'A',
        addedAt: '2026-03-20T11:00:00.000Z',
      }),
    ];

    const original = [...bookmarks];

    sortBookmarks(bookmarks);

    expect(bookmarks).toEqual(original);
  });

  it('sorts pinned bookmarks before unpinned bookmarks', () => {
    const bookmarks = [
      createBookmark({ id: '1', title: 'Unpinned', pinned: false }),
      createBookmark({ id: '2', title: 'Pinned', pinned: true }),
    ];

    const result = sortBookmarks(bookmarks);

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('sorts by addedAt descending by default', () => {
    const bookmarks = [
      createBookmark({
        id: '1',
        title: 'Older',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
      createBookmark({
        id: '2',
        title: 'Newer',
        addedAt: '2026-03-20T11:00:00.000Z',
      }),
    ];

    const result = sortBookmarks(bookmarks);

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('sorts by addedAt ascending when requested', () => {
    const bookmarks = [
      createBookmark({
        id: '1',
        title: 'Older',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
      createBookmark({
        id: '2',
        title: 'Newer',
        addedAt: '2026-03-20T11:00:00.000Z',
      }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'addedAt',
      direction: 'asc',
    });

    expect(result.map((item) => item.id)).toEqual(['1', '2']);
  });

  it('sorts by title ascending when requested', () => {
    const bookmarks = [
      createBookmark({ id: '1', title: 'Bravo' }),
      createBookmark({ id: '2', title: 'alpha' }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'title',
      direction: 'asc',
    });

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
    expect(mockedNormalizeTitle).toHaveBeenCalledWith('Bravo');
    expect(mockedNormalizeTitle).toHaveBeenCalledWith('alpha');
  });

  it('sorts by title descending when requested', () => {
    const bookmarks = [
      createBookmark({ id: '1', title: 'Bravo' }),
      createBookmark({ id: '2', title: 'alpha' }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'title',
      direction: 'desc',
    });

    expect(result.map((item) => item.id)).toEqual(['1', '2']);
  });

  it('falls back to addedAt descending when title comparison is equal', () => {
    const bookmarks = [
      createBookmark({
        id: '1',
        title: 'Same',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
      createBookmark({
        id: '2',
        title: ' same ',
        addedAt: '2026-03-20T11:00:00.000Z',
      }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'title',
      direction: 'asc',
    });

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('falls back to normalized title when addedAt values are equal', () => {
    const bookmarks = [
      createBookmark({
        id: '1',
        title: 'Bravo',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
      createBookmark({
        id: '2',
        title: 'alpha',
        addedAt: '2026-03-20T10:00:00.000Z',
      }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'addedAt',
      direction: 'desc',
    });

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('keeps pinned priority even when sortBy is title', () => {
    const bookmarks = [
      createBookmark({ id: '1', title: 'Alpha', pinned: false }),
      createBookmark({ id: '2', title: 'Zulu', pinned: true }),
    ];

    const result = sortBookmarks(bookmarks, {
      sortBy: 'title',
      direction: 'asc',
    });

    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });
});
