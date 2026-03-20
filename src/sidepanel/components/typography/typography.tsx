import type { PropsWithChildren } from 'react';
import type { TypographyComponent, TypographyProps } from './types';
import { clsx } from 'clsx';
import classes from './typography.module.css';
import sharedClasses from '../shared.module.css';
import { Skeleton } from '../skeleton/skeleton';

export const Typography = <K extends TypographyComponent = 'p'>({
  children,
  component,
  as,
  variant = 'primary',
  size = 'normal',
  noMargin,
  textAlign,
  loading,
  loadingStartAdornment,
  loadingEndAdornment,
  slots,
  disabled,
  className,
  ...rest
}: PropsWithChildren<TypographyProps<K>>) => {
  const Component = component ?? 'p';

  return (
    <Component
      className={clsx(
        classes.root,
        classes[as ?? Component],
        classes[variant],
        classes[size],
        disabled && classes.disabled,
        noMargin && sharedClasses.noMargin,
        className,
      )}
      style={{
        textAlign,
      }}
      {...rest}
    >
      {loading ? (
        <>
          {loadingStartAdornment}
          <Skeleton
            width="200px"
            height={null}
            {...slots?.skeleton}
            className={clsx(classes.skeleton, slots?.skeleton?.className)}
          />
          {loadingEndAdornment}
        </>
      ) : (
        children
      )}
    </Component>
  );
};
