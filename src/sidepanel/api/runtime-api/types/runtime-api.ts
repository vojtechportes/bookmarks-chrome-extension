import type { BookmarksChangedResponse } from '../../../../shared/types/bookmarks-changed-response';
import type { OpenBookmarkResponse } from './open-bookmark-response';
import type { SetActiveTabResponse } from './set-active-tab-response';
import type { SummarizeTextResponse } from './summarize-response';

export interface IRuntimeApi {
  saveActiveTab(): Promise<SetActiveTabResponse>;
  openBookmark: (url: string) => Promise<OpenBookmarkResponse>;
  notifyBookmarksChanged: () => Promise<BookmarksChangedResponse>;
  summarizeActiveTab: (
    options?: SummarizerCreateOptions,
  ) => Promise<SummarizeTextResponse>;
}
