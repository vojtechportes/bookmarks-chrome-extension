import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../../../types/data-test';
import { clsx } from 'clsx';
import classes from './item.module.css';
import { Typography } from '../../../typography/typography';
import { useDarkMode } from '../../../../hooks/use-dark-mode';

export interface IItemProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Item: FC<PropsWithChildren<IItemProps>> = ({
  className,
  loading,
  children,
  startAdornment,
  endAdornment,
}) => {
  const isDark = useDarkMode();

  return (
    <div className={clsx(classes.item, className)}>
      {startAdornment}
      <Typography
        loading={loading}
        slots={{ skeleton: { variant: isDark ? 'light' : 'dark' } }}
        noMargin
      >
        {children}
      </Typography>
      {endAdornment}
    </div>
  );
};
