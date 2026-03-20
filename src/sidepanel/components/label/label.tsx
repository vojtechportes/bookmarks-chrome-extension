import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './label.module.css';

export interface ILabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>, IDataTest {
  disabled?: boolean;
}

export const Label: FC<PropsWithChildren<ILabelProps>> = ({
  disabled,
  className,
  children,
}) => (
  <label
    className={clsx(classes.root, disabled && classes.disabled, className)}
  >
    {children}
  </label>
);
