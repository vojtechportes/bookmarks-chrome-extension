import { useCallback, useMemo, useState, type FC } from 'react';
import { Dialog } from '../../../../../../components/dialog/dialog';
import { useTranslation } from 'react-i18next';
import { Textarea } from '../../../../../../components/textarea/textarea';
import type { IBookmarkItem } from '../../../../../../../shared/types/bookmark-item';
import { clsx } from 'clsx';
import classes from './rename-dialog.module.css';
import { useHandleRenameBookmark } from './hooks/use-handle-rename-bookmark';
import { Error } from '../../../../../../components/error/error';
import { Label } from '../../../../../../components/label/label';

export interface IRenameDialogProps {
  open: boolean;
  onCancel: () => void;
  data: IBookmarkItem;
  reload: () => Promise<void>;
}

export const RenameDialog: FC<IRenameDialogProps> = ({
  open,
  onCancel,
  data,
  reload,
}) => {
  const { t } = useTranslation('bookmarks-scene');
  const [titleValue, setTitleValue] = useState(data.title);

  const hasError = useMemo(() => titleValue.length === 0, [titleValue.length]);

  const canConfirm = useMemo(
    () => !hasError && titleValue.trim() !== data.title,
    [data.title, hasError, titleValue],
  );

  const { handleRenameBookmark, isRenaming } = useHandleRenameBookmark(
    reload,
    onCancel,
  );

  const handleConfirm = useCallback(() => {
    handleRenameBookmark({ id: data.id, title: titleValue });
  }, [data.id, handleRenameBookmark, titleValue]);

  return (
    <Dialog
      open={open}
      title={t('rename-dialog.title')}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      slots={{
        confirmButton: {
          disabled: !canConfirm || isRenaming,
        },
        cancelButton: {
          disabled: isRenaming,
        },
      }}
      data-test-value="rename"
    >
      <div className={clsx(classes.content)}>
        <Label htmlFor="title">{t('rename-dialog.fields.title')}</Label>

        <Textarea
          name="title"
          onChange={(event) => setTitleValue(event.target.value)}
          rows={4}
          /**
           * Intentionally disabled no-autofocus rule since
           * in this case, the input is in a dialog and should
           * be therefore focused automatically.
           *
           * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
           */
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus
        >
          {titleValue}
        </Textarea>

        {hasError && <Error>{t('rename-dialog.title-cant-be-empty')}</Error>}
      </div>
    </Dialog>
  );
};
