import { useMemo, useState, type FC } from 'react';
import { List } from '../../components/list/list';
import DeleteIcon from '../../components/icons/delete-icon.svg?react';
import { ListItem } from './components/list-item/list-item';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../components/icon-button/icon-button';
import BookmarkIcon from '../../components/icons/bookmark-icon.svg?react';
import { clsx } from 'clsx';
import classes from './list-scene.module.css';
import { Dialog } from '../../components/dialog/dialog';
import type { SortOrder } from './types/sort-order';
import { useHandleBookmarkTab } from '../../hooks/use-handle-bookmark-tab';
import { useHandleFilterData } from './hooks/use-handle-filter-data/use-handle-filter-data';
import { useSortItems } from './hooks/use-sort-items';
import { useHandleDeleteAllBookmarks } from './hooks/use-handle-delete-all-bookmarks';
import { useGetBookmarks } from '../../hooks/use-get-bookmarks';
import { useSortOptions } from './hooks/use-sort-options';

export const ListScene: FC = () => {
  const { t } = useTranslation('bookmarks-scene');
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const { handleDeleteAllBookmarks, isDeleting } =
    useHandleDeleteAllBookmarks();

  const { sortBy, direction } = useSortOptions();

  const { bookmarks, reload: reloadBookmarks } = useGetBookmarks({
    sortBy,
    direction,
  });

  const { handleBookmarkTab, isSaving } = useHandleBookmarkTab(reloadBookmarks);

  const {
    data: filteredData,
    searchTerms,
    searchValue,
    handleSearchChange,
    handleViewTypeChange,
    sortOrderStorage,
    viewTypeStorage,
  } = useHandleFilterData(bookmarks);

  const { sortItems } = useSortItems();

  const matchedNumber = useMemo(() => filteredData.length, [filteredData]);

  return (
    <>
      <Dialog
        title={t('delete-all-modal.title')}
        description={t('delete-all-modal.description')}
        open={deleteAllModalOpen}
        onCancel={() => setDeleteAllModalOpen(false)}
        onConfirm={handleDeleteAllBookmarks}
        data-test-value="delete-all"
      />

      <IconButton
        variant="primary"
        onClick={handleBookmarkTab}
        title={t('bookmark')}
        className={clsx(classes.bookmarkButton)}
        size="large"
        loading={isSaving || isDeleting}
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
          items: sortItems,
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
        loading={isDeleting}
      >
        {filteredData.map((item) => (
          <ListItem
            key={item.id}
            data={item}
            searchTerms={searchTerms}
            viewType={viewTypeStorage.value}
            loading={isDeleting}
            reload={reloadBookmarks}
          />
        ))}
      </List>
    </>
  );
};
