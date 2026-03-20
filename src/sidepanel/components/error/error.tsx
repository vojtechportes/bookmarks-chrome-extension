import type { FC, PropsWithChildren } from 'react';
import { Typography } from '../typography/typography';
import { clsx } from 'clsx';
import classes from './error.module.css';

export interface IErrorProps {
  dark?: boolean;
}

export const Error: FC<PropsWithChildren<IErrorProps>> = ({
  dark,
  children,
}) => (
  <Typography className={clsx(classes.root, dark && classes.dark)} noMargin>
    {children}
  </Typography>
);
