import { fileTypeFromBuffer } from 'file-type';
import { SAFE_RASTER_MIMES } from './constants';
import type { DECODING_FAILED, UNKNOWN_ERROR, UNSUPPORTED_TYPE } from './type';
import { ensureOffscreenDocument } from '../ensure-offscreen-document/ensure-offscreen-document.util';

export type ValidatedImage =
  | { valid: true; type: 'raster'; mimeType: string }
  | { valid: true; type: 'svg' }
  | {
      valid: false;
      reason:
        | typeof UNSUPPORTED_TYPE
        | typeof DECODING_FAILED
        | typeof UNKNOWN_ERROR;
    };

export const validateImageBlob = async (
  blob: Blob,
): Promise<ValidatedImage> => {
  const head = new Uint8Array(await blob.slice(0, 4100).arrayBuffer());
  const detected = await fileTypeFromBuffer(head);

  if (detected?.mime) {
    if (!SAFE_RASTER_MIMES.has(detected.mime)) {
      return {
        valid: false,
        reason: 'UNSUPPORTED_TYPE',
      };
    }

    const arrayBuffer = await blob.arrayBuffer();

    await ensureOffscreenDocument('OFFSCREEN_VALIDATE_IMAGE');

    const response = await chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'OFFSCREEN_VALIDATE_IMAGE',
      payload: {
        bytes: Array.from(new Uint8Array(arrayBuffer)),
        mimeType: detected.mime,
      },
    });

    if (response.ok) {
      return {
        valid: true,
        type: 'raster',
        mimeType: detected.mime,
      };
    } else {
      return {
        valid: false,
        reason: 'DECODING_FAILED',
      };
    }
  }

  try {
    const text = await blob.text();
    const trimmed = text.trimStart();

    const isSvg =
      trimmed.startsWith('<svg') ||
      (trimmed.startsWith('<?xml') && trimmed.includes('<svg'));

    if (isSvg) {
      return {
        valid: true,
        type: 'svg',
      };
    }
  } catch {
    // noop
  }

  return {
    valid: false,
    reason: 'UNKNOWN_ERROR',
  };
};
