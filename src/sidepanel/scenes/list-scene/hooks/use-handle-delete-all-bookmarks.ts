import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../shared/constants/error-messages';
import { runtimeApi } from '../../../api/runtime-api/runtime-api';

export const useHandleDeleteAllBookmarks = () => {
  const { t } = useTranslation();
  const { error, success } = useAlert();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllBookmarks = useCallback(async () => {
    try {
      setIsDeleting(true);

      const response = await runtimeApi.deleteAllBookmarks();

      if (!response.ok) {
        error(t(`error-messages.${response.error}`));
        return;
      }

      success(t('success-messages.bookmarks-deleted'));
    } catch {
      error(t(`error-messages.${UNSUPPORTED_MESSAGE_TYPE}`));
    } finally {
      setIsDeleting(false);
    }
  }, [error, success, t]);

  return { handleDeleteAllBookmarks, isDeleting };
};
