import { UNSUPPORTED_MESSAGE_TYPE } from '../../shared/constants/error-messages';
import type { BookmarkMessage } from '../../shared/types/bookmark-message';
import type { BookmarkResponse } from '../../shared/types/bookmark-response';
import { bookmarksChanged } from '../api/bookmarks-changed';
import { openBookmarkUrl } from '../api/open-bookmark-url';
import { saveActiveTabBookmark } from '../api/save-active-tab-bookmark';
import { summarizeActiveTab } from '../api/summarize-active-tab';
import { summarizeText } from '../api/summarize-text.util';

export async function handleMessage(
  message: BookmarkMessage,
): Promise<BookmarkResponse<unknown>> {
  switch (message.type) {
    case 'SAVE_ACTIVE_TAB': {
      const bookmark = await saveActiveTabBookmark();

      return { ok: true, data: bookmark };
    }

    case 'OPEN_BOOKMARK': {
      await openBookmarkUrl(
        message.payload.url,
        message.payload.newTab ?? true,
      );

      return { ok: true, data: undefined };
    }

    case 'BOOKMARKS_CHANGED': {
      await bookmarksChanged();

      return { ok: true, data: undefined };
    }

    case 'SUMMARIZE_TEXT': {
      const summary = await summarizeText(message.payload);

      return { ok: true, data: summary };
    }

    case 'SUMMARIZE_ACTIVE_TAB': {
      const summary = await summarizeActiveTab(message.payload);

      return { ok: true, data: summary };
    }

    default: {
      return {
        ok: false,
        error: UNSUPPORTED_MESSAGE_TYPE,
      };
    }
  }
}
