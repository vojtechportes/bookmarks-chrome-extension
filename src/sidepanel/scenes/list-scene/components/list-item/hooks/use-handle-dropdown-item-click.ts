import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../../../components/alert-provider/hooks/use-alert';
import { useCallback, useState } from 'react';
import { runtimeApi } from '../../../../../api/runtime-api/runtime-api';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../../../shared/constants/error-messages';

export const useHandleDropdownItemClick = (id: string) => {
  const { t } = useTranslation();
  const { success, error } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const handleDropdownItemClick = useCallback(
    async (value: string) => {
      try {
        setIsLoading(true);

        if (value === 'pin') {
          await runtimeApi.pinBookmark(id);
        }

        if (value === 'unpin') {
          await runtimeApi.unpinBookmark(id);
        }

        if (value === 'delete') {
          const response = await runtimeApi.deleteBookmark(id);

          if (!response.ok) {
            error(t(`error-messages.${response.error}`));
            return;
          }

          success(t('success-messages.bookmark-deleted'));
        }
      } catch {
        error(t(`error-messages.${UNSUPPORTED_MESSAGE_TYPE}`));
      } finally {
        setIsLoading(false);
      }
    },
    [error, id, success, t],
  );

  return { handleDropdownItemClick, isLoading };
};
