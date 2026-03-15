import { NO_ACTIVE_BOOKMARK_FOUND } from '../../shared/constants/error-messages';

export const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeTab = tabs[0];

  if (!activeTab) {
    throw new Error(NO_ACTIVE_BOOKMARK_FOUND);
  }

  return activeTab;
};
