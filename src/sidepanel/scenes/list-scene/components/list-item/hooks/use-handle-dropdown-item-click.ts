import { useTranslation } from 'react-i18next';
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useAlert } from '../../../../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../../../shared/constants/error-messages';
import { pinBookmark } from '../../../../../../shared/database/api/bookmarks/pin-bookmark';
import { unpinBookmark } from '../../../../../../shared/database/api/bookmarks/unpin-bookmark';
import { deleteBookmark } from '../../../../../../shared/database/api/bookmarks/delete-bookmark';
import { useBookmarks } from '../../../../../components/bookmarks-provider/hooks/use-bookmarks';
import { runtimeApi } from '../../../../../api/runtime-api/runtime-api';

export const useHandleDropdownItemClick = (
  id: string,
  setIsRenameModalOpen: Dispatch<SetStateAction<boolean>>,
) => {
  const { t } = useTranslation('bookmarks-scene');
  const { reloadHasBookmarks } = useBookmarks();
  const { success, error } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const handleDropdownItemClick = useCallback(
    async (value: string, reload: () => Promise<void>) => {
      try {
        setIsLoading(true);

        if (value === 'pin') {
          await pinBookmark(id);
          await reload();

          runtimeApi.notifyBookmarksChanged();
          return;
        }

        if (value === 'unpin') {
          await unpinBookmark(id);

          runtimeApi.notifyBookmarksChanged();
          return;
        }

        if (value === 'rename') {
          setIsRenameModalOpen(true);
          return;
        }

        if (value === 'delete') {
          await deleteBookmark(id);
          await reload();
          await reloadHasBookmarks();

          runtimeApi.notifyBookmarksChanged();

          success(t('success-messages.bookmark-deleted'));
          return;
        }
      } catch (caughtError: unknown) {
        const errorMessage =
          caughtError instanceof Error
            ? caughtError.message
            : UNSUPPORTED_MESSAGE_TYPE;

        error(t(`shared:error-messages.${errorMessage}`));
      } finally {
        setIsLoading(false);
      }
    },
    [error, id, reloadHasBookmarks, setIsRenameModalOpen, success, t],
  );

  return { handleDropdownItemClick, isLoading };
};
