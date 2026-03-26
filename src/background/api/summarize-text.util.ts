import { FAILED_TO_SUMMARIZE_TEXT } from '../../shared/constants/error-messages';
import { SUMMARIZE_TEXT } from '../../shared/constants/operations';
import { logger } from '../../shared/logger/logger';
import type { SummarizeTextMessage } from '../../shared/types/summarize-text-message';
import { ensureOffscreenDocument } from '../utils/ensure-offscreen-document/ensure-offscreen-document.util';

export const summarizeText = async (
  payload: SummarizeTextMessage['payload'],
): Promise<string> => {
  await ensureOffscreenDocument('OFFSCREEN_SUMMARIZE_TEXT');

  const response = await chrome.runtime.sendMessage({
    target: 'offscreen',
    type: 'OFFSCREEN_SUMMARIZE_TEXT',
    payload,
  });

  if (!response?.ok) {
    logger('error', FAILED_TO_SUMMARIZE_TEXT, {
      operation: SUMMARIZE_TEXT,
      scope: 'service-worker',
    });

    throw new Error(response?.error ?? FAILED_TO_SUMMARIZE_TEXT);
  }

  return response.data as string;
};
