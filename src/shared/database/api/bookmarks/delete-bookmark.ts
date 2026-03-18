import { ASSETS_STORE, BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';
import { BookmarkNotFoundError } from '../../errors/bookmark-not-found-error';
import { getRelatedAssetIds } from '../../utils/get-related-asset-ids.util';

export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  const databas = await getDatabase();
  const transaction = databas.transaction(
    [BOOKMARKS_STORE, ASSETS_STORE],
    'readwrite',
  );

  try {
    const bookmarksStore = transaction.objectStore(BOOKMARKS_STORE);
    const assetsStore = transaction.objectStore(ASSETS_STORE);

    const bookmark = await bookmarksStore.get(bookmarkId);

    if (!bookmark) {
      throw new BookmarkNotFoundError();
    }

    const assetIds = getRelatedAssetIds(bookmark);

    await bookmarksStore.delete(bookmarkId);

    await Promise.all(assetIds.map((assetId) => assetsStore.delete(assetId)));

    await transaction.done;
  } catch (error) {
    transaction.abort();
    throw error;
  }
};
