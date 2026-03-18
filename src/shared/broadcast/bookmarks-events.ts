import { BROADCAST_CHANNEL_NAME, BROADCAST_EVENT_NAME } from './constants';

export const bookmarksChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

export const notifyBookmarksChanged = () => {
  bookmarksChannel.postMessage({ type: BROADCAST_EVENT_NAME });
};
