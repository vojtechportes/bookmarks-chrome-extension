import type { BookmarkItem } from '../shared/types/bookmark-item';
import type { SuccessResponse } from '../shared/types/success-response';

export const activeTabResponseMock = (
  id?: string,
): SuccessResponse<BookmarkItem> => ({
  ok: true,
  data: {
    id: id ?? 'xxxx-xxxx-xxxx-xxxx-xxxx',
    description: 'Tab description',
    title: 'Tab name',
    url: 'https://example.com',
    addedAt: new Date(2026, 1, 1).toISOString(),
  },
});
