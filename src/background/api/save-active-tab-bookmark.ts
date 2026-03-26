import {
  ACTIVE_TAB_ID_MISSING,
  TAB_CANNOT_BE_BOOKMARKED,
} from '../../shared/constants/error-messages';
import type { IBookmarkItem } from '../../shared/types/bookmark-item';
import { extractPageData } from '../utils/extract-page-data.util';
import { getActiveTab } from './get-active-tab';
import { getIconUrl } from '../utils/get-icon-url.util';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { saveIconAsset } from '../utils/save-icon-asset.util';
import { saveScreenshotAsset } from '../utils/save-screenshot-asset.util';
import { addBookmark } from '../../shared/database/api/bookmarks/add-bookmark';
import { SETTINGS_USE_AI_GENERATED_DESCRIPTIONS } from '../../shared/constants/storage';
import { generateBookmarkDescription } from '../utils/generate-bookmark-description.util';
import { logger } from '../../shared/logger/logger';
import { SAVE_TAB } from '../../shared/constants/operations';
import { FAILED_TO_PERSIST_ASSET } from '../../shared/constants/warning-messages';

export const saveActiveTabBookmark = async (): Promise<IBookmarkItem> => {
  const activeTab = await getActiveTab();
  const useAiGeneratedDescriptions = (
    await chrome.storage.local.get(SETTINGS_USE_AI_GENERATED_DESCRIPTIONS)
  )[SETTINGS_USE_AI_GENERATED_DESCRIPTIONS] as boolean;

  if (!activeTab.id) {
    logger('error', ACTIVE_TAB_ID_MISSING, {
      operation: SAVE_TAB,
      scope: 'service-worker',
    });

    throw new Error(ACTIVE_TAB_ID_MISSING);
  }

  if (!activeTab.url || !isBookmarkableUrl(activeTab.url)) {
    logger('error', TAB_CANNOT_BE_BOOKMARKED, {
      operation: SAVE_TAB,
      scope: 'service-worker',
    });

    throw new Error(TAB_CANNOT_BE_BOOKMARKED);
  }

  const pageData = await extractPageData(activeTab.id);

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
    } catch {
      logger('warn', FAILED_TO_PERSIST_ASSET, {
        operation: SAVE_TAB,
        scope: 'service-worker',
      });
    }
  }

  if (resolvedDarkIconUrl) {
    try {
      darkIconAssetId = await saveIconAsset(
        bookmarkId,
        resolvedDarkIconUrl,
        'dark',
      );
    } catch {
      logger('warn', FAILED_TO_PERSIST_ASSET, {
        operation: SAVE_TAB,
        scope: 'service-worker',
      });
    }
  }

  if (resolvedLightIconUrl) {
    try {
      lightIconAssetId = await saveIconAsset(
        bookmarkId,
        resolvedLightIconUrl,
        'light',
      );
    } catch {
      logger('warn', FAILED_TO_PERSIST_ASSET, {
        operation: SAVE_TAB,
        scope: 'service-worker',
      });
    }
  }

  let screenshotAssetId: string | undefined;

  try {
    screenshotAssetId = await saveScreenshotAsset(bookmarkId);
  } catch {
    logger('warn', FAILED_TO_PERSIST_ASSET, {
      operation: SAVE_TAB,
      scope: 'service-worker',
    });
  }

  const currentDate = new Date().toISOString();

  const bookmark: IBookmarkItem = {
    id: bookmarkId,
    title: pageData.title || activeTab.title || pageData.url,
    url: pageData.url,
    icon: resolvedIconUrl,
    iconAssetId,
    lightIconAssetId,
    darkIconAssetId,
    screenshotAssetId,
    description: pageData.description,
    addedAt: currentDate,
    updatedAt: currentDate,
    pinned: false,
    isGeneratingDescription: useAiGeneratedDescriptions,
  };

  await addBookmark(bookmark);

  if (useAiGeneratedDescriptions) {
    generateBookmarkDescription(bookmarkId);
  }

  return bookmark;
};
