import type { DeleteBookmarkMessage } from './delete-bookmark-message';
import type { GetBookmarksMessage } from './get-bookmark-message';
import type { OpenBookmarkMessage } from './open-bookmark-message';
import type { SaveActiveTabMessage } from './save-active-tab-message';
import type { PinBookmarkMessage } from './pin-bookmark-message';
import type { UnpinBookmarkMessage } from './unpin-bookmark-message';
import type { DeleteAllBookmarskMessage } from './delete-all-bookmarks-message';

export type BookmarkMessage =
  | GetBookmarksMessage
  | SaveActiveTabMessage
  | DeleteBookmarkMessage
  | DeleteAllBookmarskMessage
  | OpenBookmarkMessage
  | PinBookmarkMessage
  | UnpinBookmarkMessage;
