import { clsx } from 'clsx';
import { type FC, type PropsWithChildren } from 'react';
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
  loading?: boolean;
  icon?: React.ReactNode;
  slots?: IButtonSlots;
}

export const Button: FC<PropsWithChildren<IButtonProps>> = ({
  variant = 'primary',
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
      classes.btn,
      classes[variant],
      (disabled || loading) && classes.disabled,
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
