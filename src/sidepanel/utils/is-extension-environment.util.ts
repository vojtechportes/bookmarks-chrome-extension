export const isExtensionEnvironment = (): boolean =>
  typeof chrome !== 'undefined' &&
  typeof chrome.runtime !== 'undefined' &&
  typeof chrome.runtime.sendMessage === 'function';
