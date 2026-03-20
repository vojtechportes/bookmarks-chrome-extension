import { clsx } from 'clsx';
import { Switch as SwitchBase } from 'radix-ui';
import classes from './switch.module.css';
import React from 'react';
import type { SwitchProps } from '@radix-ui/react-switch';

type SwitchElement = React.ComponentRef<typeof SwitchBase.Root>;

export const Switch = React.forwardRef<SwitchElement, SwitchProps>(
  ({ className, disabled, ...rest }, ref) => {
    return (
      <SwitchBase.Root
        ref={ref}
        className={clsx(classes.root, disabled && classes.disabled, className)}
        disabled={disabled}
        {...rest}
      >
        <SwitchBase.Thumb className={clsx(classes.thumb)} />
      </SwitchBase.Root>
    );
  },
);
