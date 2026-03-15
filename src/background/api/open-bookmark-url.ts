import { INVALID_BOOKMARK_URL } from '../../shared/constants/error-messages';
import { isBookmarkableUrl } from '../utils/is-bookmarkable-url.util';
import { getActiveTab } from './get-active-tab';

export async function openBookmarkUrl(
  url: string,
  newTab: boolean,
): Promise<void> {
  if (!isBookmarkableUrl(url)) {
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
}
