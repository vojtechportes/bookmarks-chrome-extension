import { type FC } from 'react';
import { EmptyScene } from '../scenes/empty-scene/empty-scene';
import { ListScene } from '../scenes/list-scene/list-scene';
import { useBookmarksContext } from '../components/bookmarks-provider/hooks/use-bookmarks-context';

export const App: FC = () => {
  const { hasBookmarks, isLoadingHasBookmarks } = useBookmarksContext();

  if (hasBookmarks) {
    return <ListScene />;
  }

  return <EmptyScene loading={isLoadingHasBookmarks} />;
};
