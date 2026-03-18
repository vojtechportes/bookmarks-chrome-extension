import { BOOKMARKS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const hasBookmarks = async (): Promise<boolean> => {
  const database = await getDatabase();
  const count = await database.count(BOOKMARKS_STORE);

  return count > 0;
};
