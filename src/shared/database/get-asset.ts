import { STORE_NAME } from './constants';
import { openDatabase } from './utils/open-database.util';

export const getAsset = async (id: string): Promise<Blob | undefined> => {
  const database = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as { blob: Blob } | undefined;
        resolve(result?.blob);
      };

      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
};
