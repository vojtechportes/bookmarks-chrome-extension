import { useCallback, useMemo, useState } from 'react';
import {
  BOOKMARKS_SORT_ORDER_STORAGE_KEY,
  BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
} from '../../../../shared/constants/storage';
import { useStorage } from '../../../hooks/use-storage';
import type { SortOrder } from '../types/sort-order';
import type { ViewType } from '../types/view-type';
import MiniSearch from 'minisearch';
import type { SearchableBookmark } from '../types/searchable-bookmark';
import type { BookmarkItem } from '../../../../shared/types/bookmark-item';
import { sortData } from '../utils/sort-data.util';

export const useHandleFilterData = (data: BookmarkItem[]) => {
  const [searchValue, setSearchValue] = useState('');

  const viewTypeStorage = useStorage<ViewType>(
    BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
    'tiles',
  );

  const sortOrderStorage = useStorage<SortOrder>(
    BOOKMARKS_SORT_ORDER_STORAGE_KEY,
    'newest-to-oldest',
  );

  const handleViewTypeChange = useCallback(
    (value?: ViewType) => {
      if (value) {
        viewTypeStorage.setValue(value);
      }
    },
    [viewTypeStorage],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const bookmarkMap = useMemo(
    () => new Map(data.map((item) => [item.id, item])),
    [data],
  );

  const miniSearch = useMemo(() => {
    const instance = new MiniSearch<SearchableBookmark>({
      idField: 'id',
      fields: ['title', 'url'],
      storeFields: ['id'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
    });

    instance.addAll(data);

    return instance;
  }, [data]);

  const filteredData = useMemo(() => {
    const normalizedQuery = searchValue.trim();

    if (!normalizedQuery) {
      return data;
    }

    const results = miniSearch.search(normalizedQuery);

    return results
      .map((result) => bookmarkMap.get(result.id))
      .filter((item): item is BookmarkItem => Boolean(item));
  }, [bookmarkMap, data, miniSearch, searchValue]);

  const sortedData = useMemo(() => {
    if (sortOrderStorage.loading) {
      return filteredData;
    }

    return sortData(filteredData, sortOrderStorage.value);
  }, [filteredData, sortOrderStorage.loading, sortOrderStorage.value]);

  return {
    data: sortedData,
    viewTypeStorage,
    sortOrderStorage,
    handleViewTypeChange,
    handleSearchChange,
    searchValue,
  };
};
