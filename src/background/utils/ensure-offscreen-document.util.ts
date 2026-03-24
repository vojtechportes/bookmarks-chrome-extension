import { OFFSCREEN_DOCUMENT_PATH } from '../constants';

export const ensureOffscreenDocument = async (): Promise<void> => {
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
    justification: 'Run AI summarization of web page content in a background DOM context. The summarization task may take several minutes to complete and must continue even if the extension UI (side panel) is closed or unmounted.',
  });
};
