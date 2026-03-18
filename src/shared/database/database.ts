import { openDB, type IDBPDatabase } from 'idb';
import {
  ASSETS_KEY_PATH,
  ASSETS_STORE,
  BOOKMARK_URL_INDEX,
  BOOKMARKS_KEY_PATH,
  BOOKMARKS_STORE,
  DATABASE_NAME,
  DATABASE_VERSION,
} from './constants';
import type { BookmarksDbSchema } from './schema';

let databasePromise: Promise<IDBPDatabase<BookmarksDbSchema>> | null = null;

export const getDatabase = (): Promise<IDBPDatabase<BookmarksDbSchema>> => {
  if (!databasePromise) {
    databasePromise = openDB<BookmarksDbSchema>(
      DATABASE_NAME,
      DATABASE_VERSION,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains(BOOKMARKS_STORE)) {
            const bookmarksStore = db.createObjectStore(BOOKMARKS_STORE, {
              keyPath: BOOKMARKS_KEY_PATH,
            });

            bookmarksStore.createIndex(BOOKMARK_URL_INDEX, 'url', {
              unique: true,
            });
          }

          if (!db.objectStoreNames.contains(ASSETS_STORE)) {
            db.createObjectStore(ASSETS_STORE, {
              keyPath: ASSETS_KEY_PATH,
            });
          }
        },
      },
    );
  }

  return databasePromise;
};
