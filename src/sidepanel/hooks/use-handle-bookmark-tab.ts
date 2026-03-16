import { useCallback, useState } from 'react';
import { useAlert } from '../components/alert-provider/hooks/use-alert';
import { useTranslation } from 'react-i18next';
import { runtimeApi } from '../api/runtime-api/runtime-api';
import {
  BOOKMARK_ALREADY_EXISTS,
  UNSUPPORTED_MESSAGE_TYPE,
} from '../../shared/constants/error-messages';

export const useHandleBookmarkTab = () => {
  const { t } = useTranslation();

  const { success, error, info } = useAlert();
  const [isSaving, setIsSaving] = useState(false);

  const handleBookmarkTab = useCallback(async () => {
    try {
      setIsSaving(true);

      const response = await runtimeApi.saveActiveTab();

      if (!response.ok) {
        if (response.error === BOOKMARK_ALREADY_EXISTS) {
          info(t(`info-messages.${response.error}`));
          return;
        }

        error(t(`error-messages.${response.error}`));
        return;
      }

      success(t('success-messages.bookmark-added'));
    } catch {
      error(t(`error-messages.${UNSUPPORTED_MESSAGE_TYPE}`));
    } finally {
      setIsSaving(false);
    }
  }, [error, info, success, t]);

  return { handleBookmarkTab, isSaving };
};
