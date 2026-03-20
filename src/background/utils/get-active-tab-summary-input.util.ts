import {
  NO_ACTIVE_BOOKMARK_FOUND,
  NO_READABLE_TEXT_FOUND,
} from '../../shared/constants/error-messages';
import { extractPageText } from './extract-page-text.util';

export const getActiveTabSummaryInput = async (): Promise<string> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (!tab?.id) {
    throw new Error(NO_ACTIVE_BOOKMARK_FOUND);
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractPageText,
  });

  const input = results[0]?.result?.trim();

  if (!input) {
    throw new Error(NO_READABLE_TEXT_FOUND);
  }

  return input;
};
