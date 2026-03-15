import { putAsset } from '../../shared/database/put-asset';
import { compressImageBlob } from './compress-image-blob.util';
import { dataUrlToBlob } from './data-url-to-blob.util';

export const saveScreenshotAsset = async (
  bookmarkId: string,
): Promise<string | undefined> => {
  const dataUrl = await chrome.tabs.captureVisibleTab(undefined, {
    format: 'png',
  });

  if (!dataUrl) {
    return undefined;
  }

  const originalBlob = await dataUrlToBlob(dataUrl);

  if (!originalBlob.size) {
    return undefined;
  }

  const assetId = `${bookmarkId}-screenshot`;

  let blobToStore = originalBlob;
  let mimeType = originalBlob.type || 'image/png';

  try {
    blobToStore = await compressImageBlob(originalBlob, 600, 0.8);
    mimeType = blobToStore.type || 'image/webp';
  } catch {
    blobToStore = originalBlob;
    mimeType = originalBlob.type || mimeType;
  }

  await putAsset({
    id: assetId,
    type: 'screenshot',
    mimeType,
    blob: blobToStore,
    createdAt: new Date().toISOString(),
  });

  return assetId;
};
