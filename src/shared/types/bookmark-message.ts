import type { BookmarksChangedMessage } from './bookmarks-changed-message';
import type { GoogleDriveConnect } from './google-drive-connect';
import type { GoogleDriveStatus } from './google-drive-status';
import type { GoogleDriveVerify } from './google-drive-verify';
import type { OpenBookmarkMessage } from './open-bookmark-message';
import type { SaveActiveTabMessage } from './save-active-tab-message';

export type BookmarkMessage =
  | SaveActiveTabMessage
  | OpenBookmarkMessage
  | BookmarksChangedMessage
  | GoogleDriveStatus
  | GoogleDriveConnect
  | GoogleDriveVerify;
