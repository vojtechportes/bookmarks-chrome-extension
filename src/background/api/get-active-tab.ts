import { NO_ACTIVE_BOOKMARK_FOUND } from '../../shared/constants/error-messages';
import { GET_ACTIVE_TAB } from '../../shared/constants/operations';
import { logger } from '../../shared/logger/logger';

export const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeTab = tabs[0];

  if (!activeTab) {
    logger('error', NO_ACTIVE_BOOKMARK_FOUND, {
      operation: GET_ACTIVE_TAB,
      scope: 'service-worker',
    });

    throw new Error(NO_ACTIVE_BOOKMARK_FOUND);
  }

  return activeTab;
};
