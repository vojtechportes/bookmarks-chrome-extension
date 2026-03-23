import {
  SUMMARIZE_API_IS_NOT_SUPPORTED,
  SUMMARIZE_API_IS_UNAVILABLE,
  UNKNOWN_SUMMARIZE_ERROR,
} from '../shared/constants/error-messages';
import { SUMMARIZER_OPTIONS } from '../shared/constants/summarizer';
import { DESCRIPTION_MAXIMUM_LENGTH } from '../shared/constants/text-extraction';
import type { OffscreenSummarizeTextMessage } from '../shared/types/ofscreen-summarize-text-message';

chrome.runtime.onMessage.addListener(
  (message: OffscreenSummarizeTextMessage, _sender, sendResponse) => {
    if (
      message.target !== 'offscreen' ||
      message.type !== 'OFFSCREEN_SUMMARIZE_TEXT'
    ) {
      return;
    }

    (async () => {
      try {
        if (!Summarizer) {
          sendResponse({
            ok: false,
            error: SUMMARIZE_API_IS_NOT_SUPPORTED,
          });
          return;
        }

        const availability = await Summarizer.availability(SUMMARIZER_OPTIONS);

        if (availability === 'unavailable') {
          sendResponse({
            ok: false,
            error: SUMMARIZE_API_IS_UNAVILABLE,
          });
          return;
        }

        const summarizer = await Summarizer.create({
          ...message.payload.options,
          sharedContext: `You are being provided a context of a page. Summarize what the page is about in ${DESCRIPTION_MAXIMUM_LENGTH - 3} characters at most. Use a single sentence.`,
        });

        try {
          const summary = await summarizer.summarize(message.payload.input);

          sendResponse({
            ok: true,
            data: summary,
          });
        } finally {
          summarizer.destroy?.();
        }
      } catch (error) {
        sendResponse({
          ok: false,
          error:
            error instanceof Error ? error.message : UNKNOWN_SUMMARIZE_ERROR,
        });
      }
    })();

    return true;
  },
);
