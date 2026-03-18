import type { IAssetItem } from '../../../types/asset-item';
import { ASSETS_STORE } from '../../constants';
import { getDatabase } from '../../database';

export const addAsset = async (asset: IAssetItem): Promise<IAssetItem> => {
  const database = await getDatabase();

  await database.add(ASSETS_STORE, asset);

  return asset;
};
