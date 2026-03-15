import { useCallback, type FC } from 'react';
import { Panel } from '../../components/panel/panel';
import { NotFound } from '../../components/not-found/not-found';
import { useTranslation } from 'react-i18next';
import { Stack } from '../../components/stack/stack';
import BookmarkIcon from '../../components/icons/bookmark-icon.svg?react';
import { runtimeApi } from '../../api/runtime-api/runtime-api';
import { useAlert } from '../../components/alert-provider/hooks/use-alert';

export interface IEmptySceneProps {
  loading?: boolean;
}

export const EmptyScene: FC<IEmptySceneProps> = ({ loading }) => {
  const { t } = useTranslation();
  const { error, success } = useAlert();

  const handleClick = useCallback(async () => {
    const response = await runtimeApi.saveActiveTab();

    if (!response.ok) {
      error(t(`error-messages.${response.error}`));
      return;
    }

    success(t('success-messages.bookmark-added'));
  }, [success, error, t]);

  return (
    <Stack gap={8}>
      <Panel fullHeight align="center">
        <NotFound
          title={t('no-data.title')}
          alt={t('no-data.title')}
          buttonTitle={t('no-data.button')}
          slots={{
            button: {
              onClick: handleClick,
              icon: <BookmarkIcon />,
            },
          }}
          loading={loading}
        />
      </Panel>
    </Stack>
  );
};
