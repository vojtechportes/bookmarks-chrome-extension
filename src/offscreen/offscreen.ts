import type { OffscreenRasterizeSvgMessage } from '../shared/types/offscreen-rasterize-svg-message';
import type { OffscreenSummarizeTextMessage } from '../shared/types/offscreen-summarize-text-message';
import type { OffscreenValidateImageMessage } from '../shared/types/offscreen-validate-image-message';
import { rasterizeSvg } from './utils/rasterize-svg.util';
import { summarize } from './utils/summarize.util';
import { validateImage } from './utils/validate-image.util';

chrome.runtime.onMessage.addListener(
  (
    message:
      | OffscreenSummarizeTextMessage
      | OffscreenValidateImageMessage
      | OffscreenRasterizeSvgMessage,
    _sender,
    sendResponse,
  ) => {
    if (
      message.target !== 'offscreen' ||
      (message.type !== 'OFFSCREEN_SUMMARIZE_TEXT' &&
        message.type !== 'OFFSCREEN_VALIDATE_IMAGE' &&
        message.type !== 'OFFSCREEN_RASTERIZE_SVG')
    ) {
      return;
    }

    if (
      message.target === 'offscreen' &&
      message.type === 'OFFSCREEN_SUMMARIZE_TEXT'
    ) {
      summarize(message, sendResponse);
    }

    if (
      message.target === 'offscreen' &&
      message.type === 'OFFSCREEN_VALIDATE_IMAGE'
    ) {
      const uint8Array = new Uint8Array(message.payload.bytes);
      const blob = new Blob([uint8Array], { type: message.payload.mimeType });

      validateImage(blob, sendResponse);
    }

    if (
      message.target === 'offscreen' &&
      message.type === 'OFFSCREEN_RASTERIZE_SVG'
    ) {
      const uint8Array = new Uint8Array(message.payload.bytes);
      const blob = new Blob([uint8Array], { type: 'image/svg+xml' });

      rasterizeSvg(blob, sendResponse);
    }

    return true;
  },
);
