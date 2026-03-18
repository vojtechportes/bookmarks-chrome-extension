import { type FC } from 'react';
import { EmptyScene } from '../scenes/empty-scene/empty-scene';
import { ListScene } from '../scenes/list-scene/list-scene';
import { useBookmarksContext } from '../components/bookmarks-provider/hooks/use-bookmarks-context';
import { useGoogleDriveAvailability } from '../hooks/use-google-drive-availability';

export const App: FC = () => {
  const { hasBookmarks, isLoadingHasBookmarks } = useBookmarksContext();

  const status = useGoogleDriveAvailability();

  console.log(status);

  if (hasBookmarks) {
    return <ListScene />;
  }

  return <EmptyScene loading={isLoadingHasBookmarks} />;
};
