import { type FC } from 'react';
import { Panel } from '../../components/panel/panel';
import { NotFound } from '../../components/not-found/not-found';
import { useTranslation } from 'react-i18next';
import { Stack } from '../../components/stack/stack';
import BookmarkIcon from '../../components/icons/bookmark-icon.svg?react';
import { useHandleBookmarkTab } from '../../hooks/use-handle-bookmark-tab';
import { useBookmarks } from '../../components/bookmarks-provider/hooks/use-bookmarks';

export interface IEmptySceneProps {
  loading?: boolean;
}

export const EmptyScene: FC<IEmptySceneProps> = ({ loading }) => {
  const { t } = useTranslation('bookmarks-scene');
  const { reloadHasBookmarks } = useBookmarks();
  const { handleBookmarkTab, isSaving } =
    useHandleBookmarkTab(reloadHasBookmarks);

  return (
    <Stack gap={8}>
      <Panel fullHeight align="center">
        <NotFound
          title={t('no-data.title')}
          alt={t('no-data.title')}
          buttonTitle={t('no-data.button')}
          slots={{
            button: {
              onClick: handleBookmarkTab,
              icon: <BookmarkIcon />,
              loading: isSaving,
              'data-test-value': 'bookmark',
            },
            title: {
              'data-test-value': 'no-data.title',
            },
          }}
          loading={loading}
        />
      </Panel>
    </Stack>
  );
};
