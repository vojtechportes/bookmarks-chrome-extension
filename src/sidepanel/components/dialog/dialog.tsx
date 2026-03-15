import { type FC } from 'react';
import classes from './dialog.module.css';
import { clsx } from 'clsx';
import { Typography } from '../typography/typography';
import { Button } from '../button/button';
import { useTranslation } from 'react-i18next';

export interface IDialogProps {
  open?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Dialog: FC<IDialogProps> = ({
  open = false,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(classes.backdrop)}
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className={clsx(classes.dialog)}>
        <div className={clsx(classes.title)}>
          <Typography as="h5" noMargin className={clsx(classes.typography)}>
            {title}
          </Typography>
        </div>

        {description && (
          <>
            <div className={clsx(classes.description)}>
              <Typography>{description}</Typography>
            </div>
            <div className={clsx(classes.divider)} />
          </>
        )}

        <div className={clsx(classes.actions)}>
          <Button onClick={onConfirm}>{confirmLabel ?? t('confirm')}</Button>
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel ?? t('cancel')}
          </Button>
        </div>
      </div>
    </>
  );
};
