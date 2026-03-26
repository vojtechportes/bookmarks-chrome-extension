import { useCallback, useMemo, type FC } from 'react';
import { useBookmarks } from '../../components/bookmarks-provider/hooks/use-bookmarks';
import { ListScene } from '../list-scene/list-scene';
import { EmptyScene } from '../empty-scene/empty-scene';
import { IconButton } from '../../components/icon-button/icon-button';
import classes from './bookmarks-scene.module.css';
import { clsx } from 'clsx';
import SettingsIcon from '../../components/icons/settings-icon.svg?react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getSummarizerAvailability } from '../../utils/get-summarizer-availability.util';
import { prepareSummarizer } from '../../utils/prepare-summarizer.util';
import { SUMMARIZER_OPTIONS } from '../../../shared/constants/summarizer';
import { useAlert } from '../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../shared/constants/error-messages';

export const BookmarksScene: FC = () => {
  const { t } = useTranslation('bookmarks-scene');
  const { hasBookmarks, isLoadingHasBookmarks } = useBookmarks();
  const navigate = useNavigate();
  const { error: errorAlert } = useAlert();

  const sceneElements = useMemo(() => {
    return hasBookmarks ? (
      <ListScene />
    ) : (
      <EmptyScene loading={isLoadingHasBookmarks} />
    );
  }, [hasBookmarks, isLoadingHasBookmarks]);

  const handleNavigate = useCallback(async () => {
    const { summarizerStatus } =
      await import('../../signals/summarizer-status.signal');

    /**
     * Before navigation, check whether Summarizer is already
     * downloading AI Model. In that case, reattach monitor
     * through prepareSummarizer to show download proggress
     * in settings.
     */
    const availability = await getSummarizerAvailability();

    if (availability === 'downloading') {
      try {
        prepareSummarizer(
          SUMMARIZER_OPTIONS,
          (status) => (summarizerStatus.value = status),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : UNSUPPORTED_MESSAGE_TYPE;

        errorAlert(t(`common:error-message.${errorMessage}`));
      }
    }

    navigate('/settings');
  }, [errorAlert, navigate, t]);

  return (
    <>
      {sceneElements}

      <IconButton
        className={clsx(
          classes.settingsButton,
          hasBookmarks && classes.pushLeft,
        )}
        size={hasBookmarks ? 'medium' : 'large'}
        title={t('settings')}
        onClick={handleNavigate}
        data-test-value="settings"
      >
        <SettingsIcon />
      </IconButton>
    </>
  );
};
