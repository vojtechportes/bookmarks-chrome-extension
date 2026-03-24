import React, { useCallback, useMemo, type FC } from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './input.module.css';
import { IconButton, type IIconButtonProps } from '../icon-button/icon-button';
import CloseIcon from '../icons/close-icon.svg?react';

export interface IInputSlots {
  iconButton?: IIconButtonProps;
}

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, IDataTest {
  clearable?: boolean;
  onClear?: () => void;
  slots?: IInputSlots;
}

export const Input: FC<IInputProps> = ({
  clearable,
  onClear,
  slots,
  ...rest
}) => {
  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      slots?.iconButton?.onClick?.(event);
      onClear?.();
    },
    [onClear, slots?.iconButton],
  );

  const canClear = useMemo(
    () =>
      rest?.value &&
      typeof rest?.value === 'string' &&
      rest?.value?.length &&
      clearable,
    [clearable, rest?.value],
  );

  return (
    <div
      className={clsx(classes.root)}
      data-test-name="input"
      data-test-value={rest.name}
    >
      <input type="text" className={clsx(classes.input)} {...rest} />

      {canClear && (
        <IconButton
          size="medium"
          variant="faux"
          className={clsx(classes.clearButton)}
          onClick={handleClear}
          data-test-value="clear"
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};
