import { INVALID_BOOKMARK_URL } from '../../shared/constants/error-messages';
import { OPEN_BOOKMARK } from '../../shared/constants/operations';
import { logger } from '../../shared/logger/logger';
import { sanitizeUrl } from '../../shared/logger/utils/sanitize-url.util';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { getActiveTab } from './get-active-tab';

export const openBookmarkUrl = async (
  url: string,
  newTab: boolean,
): Promise<void> => {
  if (!isBookmarkableUrl(url)) {
    logger('error', INVALID_BOOKMARK_URL, {
      operation: OPEN_BOOKMARK,
      scope: 'service-worker',
      url: sanitizeUrl(url),
    });

    throw new Error(INVALID_BOOKMARK_URL);
  }

  if (newTab) {
    await chrome.tabs.create({ url });
    return;
  }

  const activeTab = await getActiveTab();

  if (!activeTab.id) {
    await chrome.tabs.create({ url });
    return;
  }

  await chrome.tabs.update(activeTab.id, { url });
};
