import { useCallback, useMemo, useState, type FC } from 'react';
import MiniSearch from 'minisearch';
import type { BookmarkItem } from '../../../shared/types/bookmark-item';
import { List } from '../../components/list/list';
import NewestToOldestIcon from '../../components/icons/newest-to-oldest-icon.svg?react';
import OldestToNewestIcon from '../../components/icons/oldest-to-newest-icon.svg?react';
import TitleAscIcon from '../../components/icons/title-asc-icon.svg?react';
import TitleDescIcon from '../../components/icons/title-desc-icon.svg?react';
import DeleteIcon from '../../components/icons/delete-icon.svg?react';
import { ListItem } from './components/list-item/list-item';
import {
  BOOKMARKS_SORT_ORDER_STORAGE_KEY,
  BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
} from '../../../shared/constants/storage';
import { useStorage } from '../../hooks/use-storage';
import { sortData } from './utils/sort-data.util';
import { useTranslation } from 'react-i18next';
import { runtimeApi } from '../../api/runtime-api/runtime-api';
import { IconButton } from '../../components/icon-button/icon-button';
import BookmarkIcon from '../../components/icons/bookmark-icon.svg?react';
import { clsx } from 'clsx';
import classes from './list-scene.module.css';
import { Dialog } from '../../components/dialog/dialog';
import { useAlert } from '../../components/alert-provider/hooks/use-alert';
import type { SortOrder } from './types/sort-order';
import type { ViewType } from './types/view-type';
import type { SearchableBookmark } from './types/searchable-bookmark';
import { BOOKMARK_ALREADY_EXISTS } from '../../../shared/constants/error-messages';

export interface IListSceneProps {
  data: BookmarkItem[];
}

export const ListScene: FC<IListSceneProps> = ({ data }) => {
  const { t } = useTranslation();
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { success, error, info } = useAlert();

  const viewTypeStorage = useStorage<ViewType>(
    BOOKMARKS_VIEW_TYPE_STORAGE_KEY,
    'tiles',
  );

  const sortOrderStorage = useStorage<SortOrder>(
    BOOKMARKS_SORT_ORDER_STORAGE_KEY,
    'newest-to-oldest',
  );

  const handleDeleteAllBookmarks = useCallback(async () => {
    const response = await runtimeApi.deleteAllBookmarks();

    if (!response.ok) {
      error(t(`error-messages.${response.error}`));
      return;
    }

    success(t('success-messages.bookmarks-deleted'));
  }, [error, success, t]);

  const handleBookmarkTab = useCallback(async () => {
    const response = await runtimeApi.saveActiveTab();

    if (!response.ok) {
      if (response.error === BOOKMARK_ALREADY_EXISTS) {
        info(t(`info-messages.${response.error}`));
        return;
      }

      error(t(`error-messages.${response.error}`));
      return;
    }

    success(t('success-messages.bookmark-added'));
  }, [error, info, success, t]);

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

  const bookmarkMap = useMemo(() => {
    return new Map(data.map((item) => [item.id, item]));
  }, [data]);

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

  const matchedNumber = useMemo(() => filteredData.length, [filteredData]);

  return (
    <>
      <Dialog
        title={t('delete-all-modal.title')}
        description={t('delete-all-modal.description')}
        open={deleteAllModalOpen}
        onCancel={() => setDeleteAllModalOpen(false)}
        onConfirm={handleDeleteAllBookmarks}
      />

      <IconButton
        variant="primary"
        onClick={handleBookmarkTab}
        title={t('bookmark')}
        className={clsx(classes.bookmarkButton)}
        size="large"
      >
        <BookmarkIcon />
      </IconButton>

      <List
        searchProps={{
          numberMatches: matchedNumber,
          value: searchValue,
          onChange: handleSearchChange,
        }}
        viewTypeProps={{
          variant: viewTypeStorage.value,
          onChange: handleViewTypeChange,
        }}
        sortProps={{
          items: [
            {
              value: 'newest-to-oldest',
              label: t('newest-to-oldest'),
              icon: <NewestToOldestIcon />,
            },
            {
              value: 'oldest-to-newest',
              label: t('oldest-to-newest'),
              icon: <OldestToNewestIcon />,
            },
            {
              value: 'title-asc',
              label: t('title-asc'),
              icon: <TitleAscIcon />,
            },
            {
              value: 'title-desc',
              label: t('title-desc'),
              icon: <TitleDescIcon />,
            },
          ],
          value: sortOrderStorage.value,
          onChange: (value) => sortOrderStorage.setValue(value as SortOrder),
        }}
        optionsProps={{
          items: [
            {
              value: 'delete-all',
              label: t('delete-all'),
              icon: <DeleteIcon />,
            },
          ],
          onChange: () => setDeleteAllModalOpen(true),
        }}
      >
        {sortedData.map((item) => (
          <ListItem
            key={item.id}
            {...item}
            searchValue={searchValue}
            viewType={viewTypeStorage.value}
          />
        ))}
      </List>
    </>
  );
};
