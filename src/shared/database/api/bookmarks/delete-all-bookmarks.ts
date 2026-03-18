import { ASSETS_STORE, BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const deleteAllBookmarks = async (): Promise<void> => {
  const database = await getDatabase();
  const transaction = database.transaction(
    [BOOKMARKS_STORE, ASSETS_STORE],
    'readwrite',
  );

  try {
    await transaction.objectStore(BOOKMARKS_STORE).clear();
    await transaction.objectStore(ASSETS_STORE).clear();
    await transaction.done;
  } catch (error) {
    transaction.abort();
    throw error;
  }
};
