import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../../../types/data-test';
import { Typography } from '../../../typography/typography';
import classes from './title.module.css';
import { clsx } from 'clsx';
import type { ListVariantType } from '../../../list/components/filters/components/view-type/view-type';

export interface ITitleProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  viewType?: ListVariantType;
}

export const Title: FC<PropsWithChildren<ITitleProps>> = ({
  className,
  loading,
  startAdornment,
  endAdornment,
  viewType,
  children,
  ...rest
}) => (
  <div
    className={clsx(classes.title, viewType && classes[viewType], className)}
    {...rest}
  >
    {startAdornment}
    <Typography className={clsx(classes.typography)} loading={loading} noMargin>
      {children}
    </Typography>
    {endAdornment}
  </div>
);
