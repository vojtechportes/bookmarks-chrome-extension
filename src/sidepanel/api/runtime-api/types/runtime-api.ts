import type { DelteteAllBookmarksResponse } from "./delete-all-bookmarks-response";
import type { PinBookmarkResponse } from "./pin-bookmark-response";
import type { SetActiveTabResponse } from "./set-active-tab-response";
import type { UnpinBookmarkResponse } from "./unpin-bookmark-response";

export interface IRuntimeApi {
  saveActiveTab(): Promise<SetActiveTabResponse>;
  pinBookmark(id: string): Promise<PinBookmarkResponse>;
  unpinBookmark(id: string): Promise<UnpinBookmarkResponse>;
  deleteBookmark(id: string): Promise<DelteteAllBookmarksResponse>;
  deleteAllBookmarks: () => Promise<DelteteAllBookmarksResponse>;
}
