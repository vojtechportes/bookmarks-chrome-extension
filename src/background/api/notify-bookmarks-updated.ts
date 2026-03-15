export const notifyBookmarksUpdated = async (): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: 'BOOKMARKS_UPDATED',
    });
  } catch {
    // NOOP
  }
};
