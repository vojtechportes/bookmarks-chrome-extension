import { useCallback, useMemo, useState } from 'react';
import {
  BOOKMARKS_SORT_ORDER_STORAGE_KEY,
  BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
} from '../../../../../shared/constants/storage';
import { useStorage } from '../../../../hooks/use-storage';
import type { SortOrder } from '../../types/sort-order';
import type { ViewType } from '../../types/view-type';
import MiniSearch from 'minisearch';
import type { SearchableBookmark } from './types/searchable-bookmark';
import type { IBookmarkItem } from '../../../../../shared/types/bookmark-item';
import { toSearchableBookmark } from './utils/to-searchable-bookmark.util';

export const useHandleFilterData = (data: IBookmarkItem[]) => {
  const [searchValue, setSearchValue] = useState('');

  const viewTypeStorage = useStorage<ViewType>(
    BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
    'tiles',
  );

  const sortOrderStorage = useStorage<SortOrder>(
    BOOKMARKS_SORT_ORDER_STORAGE_KEY,
    'addedAt-desc',
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
      fields: ['searchTitle', 'searchUrl'],
      storeFields: ['id'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
    });

    instance.addAll(data.map(toSearchableBookmark));

    return instance;
  }, [data]);

  const { filteredResults, searchTerms } = useMemo(() => {
    const normalizedQuery = searchValue.trim();

    if (normalizedQuery.length === 0) {
      return { filteredResults: data };
    }

    const results = miniSearch.search(normalizedQuery);

    const searchTerms = results.reduce((acc, current) => {
      for (const item of current.terms) {
        acc.add(item);
      }

      return acc;
    }, new Set<string>());

    const filteredResults = results
      .map((result) => bookmarkMap.get(result.id))
      .filter((item): item is IBookmarkItem => Boolean(item));

    return { filteredResults, searchTerms: [...searchTerms] };
  }, [bookmarkMap, data, miniSearch, searchValue]);

  return {
    data: filteredResults,
    searchTerms,
    searchValue,
    viewTypeStorage,
    sortOrderStorage,
    handleViewTypeChange,
    handleSearchChange,
  };
};
