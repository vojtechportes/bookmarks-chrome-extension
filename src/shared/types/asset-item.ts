import type { AssetType } from './asset-type';

export interface IAssetItem {
  id: string;
  type: AssetType;
  mimeType: string;
  blob: Blob;
  createdAt: string;
}
