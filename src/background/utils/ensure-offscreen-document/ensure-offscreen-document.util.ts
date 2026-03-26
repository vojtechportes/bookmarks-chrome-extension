import type { OffscreenRasterizeSvgMessage } from '../../../shared/types/offscreen-rasterize-svg-message';
import type { OffscreenSummarizeTextMessage } from '../../../shared/types/offscreen-summarize-text-message';
import type { OffscreenValidateImageMessage } from '../../../shared/types/offscreen-validate-image-message';
import { OFFSCREEN_DOCUMENT_PATH } from '../../constants';
import {
  OFFSCREEN_RASTERIZE_OR_VALIDATE_IMAGE_JUSTIFICATION,
  OFFSCREEN_SUMMARIZE_AI_JUSTIFICATION,
} from './constants';

export type OFFSCREEN_DOCUMENT_TYPE =
  | OffscreenValidateImageMessage['type']
  | OffscreenRasterizeSvgMessage['type']
  | OffscreenSummarizeTextMessage['type'];

export const ensureOffscreenDocument = async (
  type: OFFSCREEN_DOCUMENT_TYPE,
): Promise<void> => {
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);

  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl],
  });

  if (contexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: ['DOM_PARSER'],
    justification:
      type === 'OFFSCREEN_SUMMARIZE_TEXT'
        ? OFFSCREEN_SUMMARIZE_AI_JUSTIFICATION
        : OFFSCREEN_RASTERIZE_OR_VALIDATE_IMAGE_JUSTIFICATION,
  });
};
