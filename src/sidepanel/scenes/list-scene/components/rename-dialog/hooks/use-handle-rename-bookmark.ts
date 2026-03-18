import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { renameBookmark } from '../../../../../../shared/database/api/bookmarks/rename-bookmark';
import { useAlert } from '../../../../../components/alert-provider/hooks/use-alert';
import { runtimeApi } from '../../../../../api/runtime-api/runtime-api';

export interface IRenameBookmarkParams {
  id: string;
  title: string;
}

export const useHandleRenameBookmark = (
  reload: () => Promise<void>,
  onRenamed: () => void,
) => {
  const { t } = useTranslation();
  const { success, error, info } = useAlert();

  const [isRenaming, setIsRenaming] = useState(false);

  const handleRenameBookmark = useCallback(
    async ({ id, title }: IRenameBookmarkParams) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        info(t('info-messages.empty-title'));
        return;
      }

      try {
        setIsRenaming(true);

        await renameBookmark(id, trimmedTitle);
        await reload();

        onRenamed();

        runtimeApi.notifyBookmarksChanged();

        success(t('success-messages.bookmark-renamed'));
      } catch {
        error(t('error-messages.renaming-bookmark-failed'));
      } finally {
        setIsRenaming(false);
      }
    },
    [error, info, onRenamed, reload, success, t],
  );

  return {
    handleRenameBookmark,
    isRenaming,
  };
};
