import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../shared/constants/error-messages';
import { deleteAllBookmarks } from '../../../../shared/database/api/bookmarks/delete-all-bookmarks';
import { useBookmarksContext } from '../../../components/bookmarks-provider/hooks/use-bookmarks-context';
import { runtimeApi } from '../../../api/runtime-api/runtime-api';

export const useHandleDeleteAllBookmarks = () => {
  const { t } = useTranslation();
  const { error: errorAlert, success: successAlert } = useAlert();
  const [isDeleting, setIsDeleting] = useState(false);
  const { reloadHasBookmarks } = useBookmarksContext();

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

      errorAlert(t(`error-messages.${errorMessage}`));
    } finally {
      setIsDeleting(false);
    }
  }, [errorAlert, reloadHasBookmarks, successAlert, t]);

  return {
    handleDeleteAllBookmarks,
    isDeleting,
  };
};
