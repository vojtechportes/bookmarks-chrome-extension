import type { BookmarkItem } from "../../../../shared/types/bookmark-item";
import type { SortOrder } from "../types";

export const sortData = (data: BookmarkItem[], sortOrder: SortOrder) => {
  const sortedData = [...data].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    if (sortOrder === "newest-to-oldest") {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }

    return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
  });

  return sortedData;
};
