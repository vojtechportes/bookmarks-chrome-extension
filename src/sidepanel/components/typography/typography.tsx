import type { FC, PropsWithChildren } from 'react';
import type { TypographyProps } from './types';
import { clsx } from 'clsx';
import classes from './typography.module.css';
import sharedClasses from '../shared.module.css';
import { Skeleton } from '../skeleton/skeleton';

export const Typography: FC<PropsWithChildren<TypographyProps>> = ({
  children,
  component: Component = 'p',
  as,
  noMargin,
  textAlign,
  loading,
  className,
  ...rest
}) => (
  <Component
    className={clsx(
      classes.typography,
      classes[as ?? Component],
      noMargin && sharedClasses.noMargin,
      className,
    )}
    style={{
      textAlign,
    }}
    {...rest}
  >
    {loading ? (
      <Skeleton
        width="200px"
        height={null}
        className={clsx(classes.skeleton)}
      />
    ) : (
      children
    )}
  </Component>
);
