import { type FC, type PropsWithChildren } from 'react';
import classes from './dialog.module.css';
import { clsx } from 'clsx';
import { Typography } from '../typography/typography';
import { Button, type IButtonProps } from '../button/button';
import { useTranslation } from 'react-i18next';
import type { IDataTest } from '../../types/data-test';
import type { IBaseTypographyProps } from '../typography/types';

export interface IDialogSlots {
  confirmButton?: IButtonProps;
  cancelButton?: IButtonProps;
  title?: IBaseTypographyProps;
  description?: IBaseTypographyProps;
}
export interface IDialogProps extends IDataTest {
  open?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  slots?: IDialogSlots;
}

export const Dialog: FC<PropsWithChildren<IDialogProps>> = ({
  open = false,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
  slots,
  children,
  ...rest
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

      <div className={clsx(classes.root)} data-test-name="dialog" {...rest}>
        <div className={clsx(classes.title)}>
          <Typography
            as="h5"
            noMargin
            className={clsx(classes.typography)}
            {...slots?.title}
          >
            {title}
          </Typography>
        </div>

        {description && (
          <>
            <div className={clsx(classes.description)}>
              <Typography {...slots?.description}>{description}</Typography>
            </div>
            <div className={clsx(classes.divider)} />
          </>
        )}

        {children && (
          <>
            {children}
            <div className={clsx(classes.divider)} />
          </>
        )}

        <div className={clsx(classes.actions)}>
          <Button
            onClick={onConfirm}
            data-test-value="confirm"
            {...slots?.confirmButton}
          >
            {confirmLabel ?? t('confirm')}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            data-test-value="cancel"
            {...slots?.cancelButton}
          >
            {cancelLabel ?? t('cancel')}
          </Button>
        </div>
      </div>
    </>
  );
};
