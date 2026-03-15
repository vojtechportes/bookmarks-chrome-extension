import { clsx } from 'clsx';
import { type FC, type PropsWithChildren } from 'react';
import classes from './button.module.css';
import type { IDataTest } from '../../types/data-test';
import { Skeleton } from '../skeleton/skeleton';

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, IDataTest {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: FC<PropsWithChildren<IButtonProps>> = ({
  variant = 'primary',
  loading,
  disabled,
  icon,
  className,
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
      <Skeleton />
    ) : (
      <>
        {icon && <div className={clsx(classes.iconContainer)}>{icon}</div>}
        <div>{children}</div>
      </>
    )}
  </button>
);
