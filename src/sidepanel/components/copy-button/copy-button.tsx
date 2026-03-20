import { useCallback, type FC } from 'react';
import { IconButton, type IIconButtonProps } from '../icon-button/icon-button';
import CopyIcon from '../icons/copy-icon.svg?react';
import type { IDataTest } from '../../types/data-test';
import classes from './copy-button.module.css';
import { clsx } from 'clsx';
import { useAlert } from '../alert-provider/hooks/use-alert';

export interface ICopyButtonSlots {
  iconButton?: IIconButtonProps;
}

export interface ICopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, IDataTest {
  value: string;
  display?: 'inline' | 'block';
  slots?: ICopyButtonSlots;
  successMessage?: string;
  errorMessage?: string;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  value,
  display = 'inline',
  slots,
  successMessage,
  errorMessage,
  className,
  ...rest
}) => {
  const { success: successAlert, error: errorAlert } = useAlert();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);

      if (successMessage) {
        successAlert(successMessage);
      }
    } catch {
      if (errorMessage) {
        errorAlert(errorMessage);
        return;
      }
    }
  }, [errorAlert, errorMessage, successAlert, successMessage, value]);

  return (
    <IconButton
      {...slots?.iconButton}
      {...rest}
      className={clsx(
        classes[display],
        slots?.iconButton?.className,
        className,
      )}
      onClick={handleCopy}
    >
      <CopyIcon />
    </IconButton>
  );
};
