import { isSafeIconUrl } from "./is-safe-icon-url.util";

export const getIconUrl = (tab: chrome.tabs.Tab, extractedIcon?: string): string | undefined => {
  if (tab.favIconUrl && isSafeIconUrl(tab.favIconUrl)) {
    return tab.favIconUrl;
  }

  if (extractedIcon && isSafeIconUrl(extractedIcon)) {
    return extractedIcon;
  }

  return undefined;
}