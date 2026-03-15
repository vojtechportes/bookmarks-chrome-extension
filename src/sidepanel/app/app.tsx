import { type FC } from 'react';
import { useStorage } from '../hooks/use-storage';
import { BOOKMARKS_STORAGE_KEY } from '../../shared/constants/storage';
import { EmptyScene } from '../scenes/empty-scene/empty-scene';
import type { BookmarkItem } from '../../shared/types/bookmark-item';
import { ListScene } from '../scenes/list-scene/list-scene';

export const App: FC = () => {
  const { loading, value } = useStorage<BookmarkItem[]>(
    BOOKMARKS_STORAGE_KEY,
    [],
  );

  if (value && value.length > 0) {
    return <ListScene data={value} />;
  }

  return <EmptyScene loading={loading} />;
};
