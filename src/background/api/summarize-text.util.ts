import { FAILED_TO_SUMMARIZE_TEXT } from '../../shared/constants/error-messages';
import type { SummarizeTextMessage } from '../../shared/types/summarize-text-message';
import { ensureOffscreenDocument } from '../utils/ensure-offscreen-document.util';

export const summarizeText = async (
  payload: SummarizeTextMessage['payload'],
): Promise<string> => {
  await ensureOffscreenDocument();

  const response = await chrome.runtime.sendMessage({
    target: 'offscreen',
    type: 'OFFSCREEN_SUMMARIZE_TEXT',
    payload,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? FAILED_TO_SUMMARIZE_TEXT);
  }

  return response.data as string;
};
