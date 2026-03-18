import { UNSUPPORTED_MESSAGE_TYPE } from '../../shared/constants/error-messages';
import type { BookmarkMessage } from '../../shared/types/bookmark-message';
import type { BookmarkResponse } from '../../shared/types/bookmark-response';
import { bookmarksChanged } from '../api/bookmarks-changed';
import { openBookmarkUrl } from '../api/open-bookmark-url';
import { saveActiveTabBookmark } from '../api/save-active-tab-bookmark';
import {
  connectGoogleDrive,
  getGoogleDriveAvailability,
} from './google-drive.util';
import { verifyGoogleDriveAppDataAccess } from './verify-google-drive-app-data-access.util';

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

    case 'GOOGLE_DRIVE_STATUS': {
      const availability = await getGoogleDriveAvailability();

      return { ok: true, data: availability };
    }

    case 'GOOGLE_DRIVE_CONNECT': {
      const availability = await connectGoogleDrive();

      return { ok: true, data: availability };
    }

    case 'GOOGLE_DRIVE_VERIFY': {
      const verified = await verifyGoogleDriveAppDataAccess();

      return { ok: true, data: verified };
    }

    default: {
      return {
        ok: false,
        error: UNSUPPORTED_MESSAGE_TYPE,
      };
    }
  }
}
