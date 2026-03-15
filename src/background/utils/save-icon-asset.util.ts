import { FAILED_TO_FETCH_ICON } from "../../shared/constants/error-messages";
import { putAsset } from "../../shared/database/put-asset";
import { compressImageBlob } from "./compress-image-blob.util";

export const saveIconAsset = async (
  bookmarkId: string,
  iconUrl: string,
): Promise<string | undefined> => {
  const response = await fetch(iconUrl, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(FAILED_TO_FETCH_ICON);
  }

  const originalBlob = await response.blob();

  if (!originalBlob.size) {
    return undefined;
  }

  const assetId = `${bookmarkId}-icon`;

  let blobToStore = originalBlob;
  let mimeType = originalBlob.type || "image/png";

  if (!mimeType.includes("svg")) {
    try {
      blobToStore = await compressImageBlob(originalBlob, 48, 0.9);
      mimeType = blobToStore.type || "image/webp";
    } catch {
      blobToStore = originalBlob;
      mimeType = originalBlob.type || mimeType;
    }
  }

  await putAsset({
    id: assetId,
    type: "favicon",
    mimeType,
    blob: blobToStore,
    createdAt: new Date().toISOString(),
  });

  return assetId;
};