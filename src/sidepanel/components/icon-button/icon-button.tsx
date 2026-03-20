import { type FC, type PropsWithChildren } from 'react';
import type { IDataTest } from '../../types/data-test';
import classes from './icon-button.module.css';
import { clsx } from 'clsx';
import type React from 'react';
import { Skeleton } from '../skeleton/skeleton';
import type { ICircleSkeletonProps } from '../skeleton/types';

export interface IIconButtonSlots {
  skeleton?: Omit<ICircleSkeletonProps, 'shape'>;
}
export interface IIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, IDataTest {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'faux';
  apperance?: 'normal' | 'outlined';
  transparent?: boolean;
  loading?: boolean;
  slots?: IIconButtonSlots;
}

export const IconButton: FC<PropsWithChildren<IIconButtonProps>> = ({
  size = 'large',
  variant = 'primary',
  apperance = 'normal',
  transparent,
  disabled,
  loading,
  children,
  className,
  slots,
  ...rest
}) => (
  <button
    className={clsx(
      classes.root,
      classes[variant],
      classes[size],
      classes[apperance],
      transparent && classes.transparent,
      (disabled || loading) && classes.disabled,
      loading && classes.loading,
      className,
    )}
    disabled={disabled}
    {...rest}
  >
    {loading ? (
      <Skeleton size="100%" shape="circle" {...slots?.skeleton} />
    ) : (
      children
    )}
  </button>
);
