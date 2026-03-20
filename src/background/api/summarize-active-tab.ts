import type { SummarizeActiveTabMessage } from '../../shared/types/summarize-active-tab-message';
import { getActiveTabSummaryInput } from '../utils/get-active-tab-summary-input.util';
import { summarizeText } from './summarize-text.util';

export const summarizeActiveTab = async (
  payload?: SummarizeActiveTabMessage['payload'],
): Promise<string> => {
  const input = await getActiveTabSummaryInput();

  return summarizeText({
    input,
    options: payload?.options,
  });
};
