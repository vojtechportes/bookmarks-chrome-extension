export type SummarizeTextMessage = {
  type: 'SUMMARIZE_TEXT';
  payload: {
    input: string;
    options?: SummarizerCreateOptions;
  };
};
