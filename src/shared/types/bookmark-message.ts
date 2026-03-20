import type { BookmarksChangedMessage } from './bookmarks-changed-message';
import type { OpenBookmarkMessage } from './open-bookmark-message';
import type { SaveActiveTabMessage } from './save-active-tab-message';
import type { SummarizeActiveTabMessage } from './summarize-active-tab-message';
import type { SummarizeTextMessage } from './summarize-text-message';

export type BookmarkMessage =
  | SaveActiveTabMessage
  | OpenBookmarkMessage
  | BookmarksChangedMessage
  | SummarizeTextMessage
  | SummarizeActiveTabMessage;
