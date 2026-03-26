import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../../../components/alert-provider/hooks/use-alert';
import { useCallback } from 'react';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../../../shared/constants/error-messages';
import { runtimeApi } from '../../../../../api/runtime-api/runtime-api';
import { logger } from '../../../../../../shared/logger/logger';
import { sanitizeUrl } from '../../../../../../shared/logger/utils/sanitize-url.util';

export const useHandleOpenBookmark = (url: string) => {
  const { t } = useTranslation(['bookmarks-scene', 'common']);
  const { error } = useAlert();

  const handleOpenBookmark = useCallback(
    async (event: React.MouseEvent) => {
      try {
        const element = event.target as HTMLElement;

        if (
          element.closest(
            'button, [role="menuitem"], [role="menu"], .safe-area',
          )
        ) {
          return;
        }

        const response = await runtimeApi.openBookmark(url);

        if (!response.ok) {
          logger('error', response.error, {
            scope: 'sidepanel',
            url: sanitizeUrl(url),
          });

          error(t(`common:error-messages.${response.error}`));
        }
      } catch {
        logger('error', UNSUPPORTED_MESSAGE_TYPE, {
          scope: 'sidepanel',
          url: sanitizeUrl(url),
        });

        error(t(`common:error-messages.${UNSUPPORTED_MESSAGE_TYPE}`));
      }
    },
    [url, error, t],
  );

  return { handleOpenBookmark };
};
