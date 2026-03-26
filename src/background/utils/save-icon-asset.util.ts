import { FAILED_TO_FETCH_ICON } from '../../shared/constants/error-messages';
import { SAVE_ASSET } from '../../shared/constants/operations';
import { addAsset } from '../../shared/database/api/assets/add-asset';
import { logger } from '../../shared/logger/logger';
import { compressImageBlob } from './compress-image-blob.util';
import { rasterizeSvg } from './rasterize-svg.util';
import { validateImageBlob } from './validate-image-blob/validate-image-blob.util';

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

  const validatedImageBlob = await validateImageBlob(originalBlob);

  if (!validatedImageBlob.valid) {
    logger('error', FAILED_TO_FETCH_ICON, {
      operation: SAVE_ASSET,
      scope: 'service-worker',
      bookmarkId,
    });

    throw new Error(FAILED_TO_FETCH_ICON);
  }

  const assetId = `${bookmarkId}-${suffix}-icon`;

  let blobToStore = originalBlob;
  let mimeType = originalBlob.type;

  if (mimeType.includes('svg')) {
    const rasterizedSvg = await rasterizeSvg(blobToStore);

    if (rasterizedSvg) {
      blobToStore = rasterizedSvg;
      mimeType = 'image/png';
    }
  }

  if (!mimeType.includes('svg')) {
    try {
      blobToStore = await compressImageBlob(blobToStore, 48, 0.9);
      mimeType = blobToStore.type;
    } catch {
      logger('error', FAILED_TO_FETCH_ICON, {
        operation: SAVE_ASSET,
        scope: 'service-worker',
        bookmarkId,
      });

      throw new Error(FAILED_TO_FETCH_ICON);
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
