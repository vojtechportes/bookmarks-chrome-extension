import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import classes from './stack.module.css';
import { normalizeSize } from '../../utils/normalize-size.util';

export interface IStackProps {
  gap: number | string | null;
  className?: string;
}

export const Stack: FC<PropsWithChildren<IStackProps>> = ({
  gap,
  className,
  children,
}) => (
  <div
    className={clsx(classes.root, className)}
    style={{ gap: normalizeSize(gap) }}
  >
    {children}
  </div>
);
