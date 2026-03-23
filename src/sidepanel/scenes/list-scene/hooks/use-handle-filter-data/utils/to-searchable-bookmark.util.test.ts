import { describe, expect, it } from 'vitest';
import { toSearchableBookmark } from './to-searchable-bookmark.util';
import type { IBookmarkItem } from '../../../../../../shared/types/bookmark-item';
import { activeTabResponseMock } from '../../../../../../__mocks__/active-tab-response.mock';

describe('toSearchableBookmark', () => {
  it('it preserves original bookmark fields and adds searchable strings', () => {
    const mockBookmark: IBookmarkItem = {
      ...activeTabResponseMock().data,
      title: 'Ondřej is a singer',
      url: 'http://ondrej.com/is/singer',
    };

    const result = toSearchableBookmark(mockBookmark);

    expect(result).toMatchObject({
      ...mockBookmark,
    });

    expect(result.searchTitle).toContain('ond');
    expect(result.searchTitle).toContain('řej');
    expect(result.searchTitle).toContain('rej');
    expect(result.searchTitle).toContain('singer');

    expect(result.searchUrl).toContain('http');
    expect(result.searchUrl).toContain('ondrej');
    expect(result.searchUrl).toContain('com');
    expect(result.searchUrl).toContain('singer');
  });

  it('it preserves original bookmark fields and adds searchable strings with no tokenizable content', () => {
    const mockBookmark: IBookmarkItem = {
      ...activeTabResponseMock().data,
      title: '...',
      url: '...',
    };

    const result = toSearchableBookmark(mockBookmark);

    expect(result).toMatchObject({
      ...mockBookmark,
    });

    expect(result.searchTitle).toContain('');
    expect(result.searchUrl).toContain('');
  });
});
