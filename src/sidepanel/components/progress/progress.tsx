import * as React from 'react';
import { Progress as ProgressBase } from 'radix-ui';
import classes from './progress.module.css';
import type { ProgressProps } from '@radix-ui/react-progress';
import { clsx } from 'clsx';

type ProgressElement = React.ComponentRef<typeof ProgressBase.Root>;

export const Progress = React.forwardRef<
  ProgressElement,
  ProgressProps & React.RefAttributes<HTMLDivElement>
>(({ value, className, ...rest }, ref) => (
  <ProgressBase.Root
    ref={ref}
    className={clsx(classes.root, className)}
    value={value}
    data-test-name="proggress"
    {...rest}
  >
    <ProgressBase.Indicator
      className={clsx(classes.indicator)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressBase.Root>
));
