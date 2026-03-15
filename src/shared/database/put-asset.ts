import { STORE_NAME } from "./constants";
import { openDatabase } from "./utils/open-database.util";

export const putAsset = async (asset: {
  id: string;
  type: "favicon" | "screenshot";
  mimeType: string;
  blob: Blob;
  createdAt: string;
}): Promise<void> => {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      store.put(asset);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
};