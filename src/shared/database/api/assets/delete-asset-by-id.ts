import { ASSETS_STORE } from '../../constants';
import { getDatabase } from '../../database';

// NOT NEEDED?

export const deleteAssetById = async (assetId: string): Promise<void> => {
  const database = await getDatabase();

  await database.delete(ASSETS_STORE, assetId);
};
