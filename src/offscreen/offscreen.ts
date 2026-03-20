import {
  SUMMARIZE_API_IS_NOT_SUPPORTED,
  SUMMARIZE_API_IS_UNAVILABLE,
  UNKNOWN_SUMMARIZE_ERROR,
} from '../shared/constants/error-messages';
import { SUMMARIZER_OPTIONS } from '../shared/constants/summarizer';
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
          sharedContext:
            'You are being provided a context of a page. Summarize what the page is about in maximum 3 sentences or 160 characters at most. The summary should be then used as a description for a bookmark user created.',
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
