import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../shared/constants/error-messages';
import { deleteAllBookmarks } from '../../../../shared/database/api/bookmarks/delete-all-bookmarks';
import { useBookmarks } from '../../../components/bookmarks-provider/hooks/use-bookmarks';
import { runtimeApi } from '../../../api/runtime-api/runtime-api';
import { logger } from '../../../../shared/logger/logger';

export const useHandleDeleteAllBookmarks = () => {
  const { t } = useTranslation(['bookmarks-scene', 'common']);
  const { error: errorAlert, success: successAlert } = useAlert();
  const [isDeleting, setIsDeleting] = useState(false);
  const { reloadHasBookmarks } = useBookmarks();

  const handleDeleteAllBookmarks = useCallback(async () => {
    try {
      setIsDeleting(true);

      await deleteAllBookmarks();
      await reloadHasBookmarks();

      runtimeApi.notifyBookmarksChanged();

      successAlert(t('success-messages.bookmarks-deleted'));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : UNSUPPORTED_MESSAGE_TYPE;

      logger('error', errorMessage, { scope: 'sidepanel' }, error);

      errorAlert(t(`common:error-messages.${errorMessage}`));
    } finally {
      setIsDeleting(false);
    }
  }, [errorAlert, reloadHasBookmarks, successAlert, t]);

  return {
    handleDeleteAllBookmarks,
    isDeleting,
  };
};
