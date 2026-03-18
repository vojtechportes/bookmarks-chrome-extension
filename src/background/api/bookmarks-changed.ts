export const bookmarksChanged = async (): Promise<void> => {
  await chrome.runtime.sendMessage({
    type: 'BOOKMARKS_INVALIDATE',
  });
};
