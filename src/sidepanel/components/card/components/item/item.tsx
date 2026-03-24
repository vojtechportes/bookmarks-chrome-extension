import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../../../types/data-test';
import { clsx } from 'clsx';
import classes from './item.module.css';
import { Typography } from '../../../typography/typography';
import { useDarkMode } from '../../../../hooks/use-dark-mode';
import type { IRectangleSkeletonProps } from '../../../skeleton/types';
import type { TypographyProps } from '../../../typography/types';

export interface IItemSlots {
  skeleton?: IRectangleSkeletonProps;
  typography?: TypographyProps;
}
export interface IItemProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  slots?: IItemSlots;
}

export const Item: FC<PropsWithChildren<IItemProps>> = ({
  className,
  loading,
  children,
  startAdornment,
  endAdornment,
  slots,
}) => {
  const isDark = useDarkMode();

  return (
    <div className={clsx(classes.item, className)} data-test-name="item">
      {startAdornment}
      <Typography
        loading={loading}
        slots={{
          skeleton: { variant: isDark ? 'light' : 'dark', ...slots?.skeleton },
        }}
        noMargin
        {...slots?.typography}
      >
        {children}
      </Typography>
      {endAdornment}
    </div>
  );
};
