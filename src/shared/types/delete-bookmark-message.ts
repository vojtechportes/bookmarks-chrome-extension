export type DeleteBookmarkMessage = {
  type: 'DELETE_BOOKMARK';
  payload: {
    id: string;
  };
};
