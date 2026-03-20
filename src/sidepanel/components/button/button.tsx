import { clsx } from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import classes from './button.module.css';
import type { IDataTest } from '../../types/data-test';
import { Skeleton } from '../skeleton/skeleton';
import type { IRectangleSkeletonProps } from '../skeleton/types';

export interface IButtonSlots {
  skeleton?: Omit<IRectangleSkeletonProps, 'shape'>;
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, IDataTest {
  variant?: 'primary' | 'secondary' | 'faux';
  outlined?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  slots?: IButtonSlots;
}

export const Button: FC<PropsWithChildren<IButtonProps>> = ({
  variant = 'primary',
  outlined,
  loading,
  disabled,
  icon,
  className,
  slots,
  children,
  ...rest
}) => (
  <button
    className={clsx(
      classes.root,
      classes[variant],
      (disabled || loading) && classes.disabled,
      outlined && classes.outlined,
      icon && classes.icon,
      className,
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <Skeleton {...slots?.skeleton} />
    ) : (
      <>
        {icon && <div className={clsx(classes.iconContainer)}>{icon}</div>}
        <div>{children}</div>
      </>
    )}
  </button>
);
