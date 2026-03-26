import { FAILED_TO_FETCH_ICON } from '../../shared/constants/error-messages';
import { SAVE_ASSET } from '../../shared/constants/operations';
import { addAsset } from '../../shared/database/api/assets/add-asset';
import { logger } from '../../shared/logger/logger';
import { compressImageBlob } from './compress-image-blob.util';

export const saveIconAsset = async (
  bookmarkId: string,
  iconUrl: string,
  suffix?: string,
): Promise<string | undefined> => {
  const response = await fetch(iconUrl, {
    credentials: 'include',
  });

  if (!response.ok) {
    logger('error', FAILED_TO_FETCH_ICON, {
      operation: SAVE_ASSET,
      scope: 'service-worker',
      bookmarkId,
    });

    throw new Error(FAILED_TO_FETCH_ICON);
  }

  const originalBlob = await response.blob();

  if (!originalBlob.size) {
    return undefined;
  }

  const assetId = `${bookmarkId}-${suffix}-icon`;

  let blobToStore = originalBlob;
  let mimeType = originalBlob.type || 'image/png';

  if (!mimeType.includes('svg')) {
    try {
      blobToStore = await compressImageBlob(originalBlob, 48, 0.9);
      mimeType = blobToStore.type || 'image/webp';
    } catch {
      blobToStore = originalBlob;
      mimeType = originalBlob.type || mimeType;
    }
  }

  await addAsset({
    id: assetId,
    type: 'favicon',
    mimeType,
    blob: blobToStore,
    createdAt: new Date().toISOString(),
  });

  return assetId;
};
