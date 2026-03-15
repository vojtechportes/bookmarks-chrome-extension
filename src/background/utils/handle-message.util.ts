import { UNSUPPORTED_MESSAGE_TYPE } from "../../shared/constants/error-messages";
import type { BookmarkMessage } from "../../shared/types/bookmark-message";
import type { BookmarkResponse } from "../../shared/types/bookmark-response";
import { deleteAllBookmarks } from "../api/delete-all-bookmarks";
import { deleteBookmark } from "../api/delete-bookmark";
import { getBookmarks } from "../api/get-bookmarks";
import { notifyBookmarksUpdated } from "../api/notify-bookmarks-updated";
import { openBookmarkUrl } from "../api/open-bookmark-url";
import { pinBookmark } from "../api/pin-bookmark";
import { saveActiveTabBookmark } from "../api/set-active-tab-bookmark";
import { unpinBookmark } from "../api/unpin-bookmark";

export async function handleMessage(
  message: BookmarkMessage,
): Promise<BookmarkResponse<any>> {
  switch (message.type) {
    case "GET_BOOKMARKS": {
      const bookmarks = await getBookmarks();

      return { ok: true, data: bookmarks };
    }

    case "SAVE_ACTIVE_TAB": {
      const bookmark = await saveActiveTabBookmark();
      await notifyBookmarksUpdated();

      return { ok: true, data: bookmark };
    }

    case "PIN_BOOKMARK": {
      await pinBookmark(message.payload.id);
      await notifyBookmarksUpdated();

      return { ok: true, data: undefined };
    }

    case "UNPIN_BOOKMARK": {
      await unpinBookmark(message.payload.id);
      await notifyBookmarksUpdated();

      return { ok: true, data: undefined };
    }

    case "DELETE_BOOKMARK": {
      await deleteBookmark(message.payload.id);
      await notifyBookmarksUpdated();

      return { ok: true, data: undefined };
    }

    case "DELETE_ALL_BOOKMARKS": {
      await deleteAllBookmarks();
      await notifyBookmarksUpdated();

      return { ok: true, data: undefined };
    }

    case "OPEN_BOOKMARK": {
      await openBookmarkUrl(
        message.payload.url,
        message.payload.newTab ?? true,
      );

      return { ok: true, data: undefined };
    }

    default: {
      return {
        ok: false,
        error: UNSUPPORTED_MESSAGE_TYPE,
      };
    }
  }
}
