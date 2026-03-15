export type UnpinBookmarkMessage = {
  type: "UNPIN_BOOKMARK";
  payload: {
    id: string;
  };
};
