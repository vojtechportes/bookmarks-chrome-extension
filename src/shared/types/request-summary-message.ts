export type RequestSummaryMessage = {
  type: 'REQUEST_SUMMARY';
  payload: {
    input: string;
    options?: SummarizerCreateOptions;
  };
};
