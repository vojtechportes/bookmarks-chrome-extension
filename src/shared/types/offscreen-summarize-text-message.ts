export type OffscreenSummarizeTextMessage = {
  target: 'offscreen';
  type: 'OFFSCREEN_SUMMARIZE_TEXT';
  payload: {
    input: string;
    options?: SummarizerCreateOptions;
  };
};
