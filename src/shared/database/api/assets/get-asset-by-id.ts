import type { IAssetItem } from '../../../types/asset-item';
import { ASSETS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const getAssetById = async (
  assetId: string,
): Promise<IAssetItem | undefined> => {
  const database = await getDatabase();

  return database.get(ASSETS_STORE, assetId);
};
