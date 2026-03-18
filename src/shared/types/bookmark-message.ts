import type { BookmarksChangedMessage } from './bookmarks-changed-message';
import type { OpenBookmarkMessage } from './open-bookmark-message';
import type { SaveActiveTabMessage } from './save-active-tab-message';

export type BookmarkMessage =
  | SaveActiveTabMessage
  | OpenBookmarkMessage
  | BookmarksChangedMessage;
