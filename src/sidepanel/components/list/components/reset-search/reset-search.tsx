import type { FC, PropsWithChildren } from 'react';
import { Button } from '../../../button/button';
import classes from './reset-search.module.css';
import { clsx } from 'clsx';

export interface IResetSearchProps {
  onClick: () => void;
}

export const ResetSearch: FC<PropsWithChildren<IResetSearchProps>> = ({
  onClick,
  children,
}) => (
  <Button variant="faux" onClick={onClick} className={clsx(classes.root)}>
    {children}
  </Button>
);
