export type SummarizeActiveTabMessage = {
  type: 'SUMMARIZE_ACTIVE_TAB';
  payload: {
    options?: SummarizerCreateOptions;
  };
};
