import {
  ACTIVE_TAB_ID_MISSING,
  BOOKMARK_ALREADY_EXISTS,
  TAB_CANNOT_BE_BOOKMARKED,
} from '../../shared/constants/error-messages';
import type { BookmarkItem } from '../../shared/types/bookmark-item';
import { extractPageData } from '../utils/extract-page-data.util';
import { getActiveTab } from './get-active-tab';
import { getBookmarks } from './get-bookmarks';
import { getIconUrl } from '../utils/get-icon-url.util';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { saveIconAsset } from '../utils/save-icon-asset.util';
import { saveScreenshotAsset } from '../utils/save-screenshot-asset.util';
import { setBookmarks } from './set-bookmarks';

export const saveActiveTabBookmark = async (): Promise<BookmarkItem> => {
  const activeTab = await getActiveTab();

  if (!activeTab.id) {
    throw new Error(ACTIVE_TAB_ID_MISSING);
  }

  if (!activeTab.url || !isBookmarkableUrl(activeTab.url)) {
    throw new Error(TAB_CANNOT_BE_BOOKMARKED);
  }

  const pageData = await extractPageData(activeTab.id);

  const bookmarks = await getBookmarks();

  const existingBookmark = bookmarks.find((item) => item.url === pageData.url);

  if (existingBookmark) {
    throw new Error(BOOKMARK_ALREADY_EXISTS);
  }

  const bookmarkId = crypto.randomUUID();
  const resolvedIconUrl = getIconUrl(activeTab, pageData.icon);
  const resolvedDarkIconUrl = getIconUrl(activeTab, pageData.iconDark);
  const resolvedLightIconUrl = getIconUrl(activeTab, pageData.iconLight);

  let iconAssetId: string | undefined;
  let darkIconAssetId: string | undefined;
  let lightIconAssetId: string | undefined;

  if (resolvedIconUrl) {
    try {
      iconAssetId = await saveIconAsset(bookmarkId, resolvedIconUrl);
    } catch (error) {
      console.warn('[bookmark-extension] failed to persist icon asset', error);
    }
  }

  if (resolvedDarkIconUrl) {
    try {
      darkIconAssetId = await saveIconAsset(bookmarkId, resolvedDarkIconUrl);
    } catch (error) {
      console.warn('[bookmark-extension] failed to persist icon asset', error);
    }
  }

  if (resolvedLightIconUrl) {
    try {
      lightIconAssetId = await saveIconAsset(bookmarkId, resolvedLightIconUrl);
    } catch (error) {
      console.warn('[bookmark-extension] failed to persist icon asset', error);
    }
  }

  let screenshotAssetId: string | undefined;

  try {
    screenshotAssetId = await saveScreenshotAsset(bookmarkId);
  } catch (error) {
    console.warn(
      '[bookmark-extension] failed to persist screenshot asset',
      error,
    );
  }

  const bookmark: BookmarkItem = {
    id: bookmarkId,
    title: pageData.title || activeTab.title || pageData.url,
    url: pageData.url,
    icon: resolvedIconUrl,
    iconAssetId,
    lightIconAssetId,
    darkIconAssetId,
    screenshotAssetId,
    description: pageData.description,
    addedAt: new Date().toISOString(),
    pinned: false,
  };

  const nextBookmarks = [bookmark, ...bookmarks];

  await setBookmarks(nextBookmarks);

  return bookmark;
};
