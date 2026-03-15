export type OpenBookmarkMessage = {
  type: 'OPEN_BOOKMARK';
  payload: {
    url: string;
    newTab?: boolean;
  };
};
