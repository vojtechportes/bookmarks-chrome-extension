import { FAILED_TO_GET_CANVAS_TEXT } from '../../shared/constants/error-messages';

export const compressImageBlob = async (
  blob: Blob,
  maxWidth = 800,
  quality = 0.8,
): Promise<Blob> => {
  const bitmap = await createImageBitmap(blob);

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error(FAILED_TO_GET_CANVAS_TEXT);
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  return await canvas.convertToBlob({
    type: 'image/webp',
    quality,
  });
};
