import { DropdownMenu as DropdownMenuBase } from 'radix-ui';
import type { FC, PropsWithChildren } from 'react';
import dropdownMenuClasses from './dropdown-menu.module.css';
import { clsx } from 'clsx';
import type React from 'react';

export interface IDropdownMenuItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface IDropdownMenuProps {
  trigger: React.ReactNode;
  onChange: (value: string) => void;
  value?: string;
  items: IDropdownMenuItem[];
}

export const DropdownMenu: FC<PropsWithChildren<IDropdownMenuProps>> = ({
  trigger,
  onChange,
  value,
  items,
}) => (
  <DropdownMenuBase.Root modal={false}>
    <DropdownMenuBase.Trigger asChild>{trigger}</DropdownMenuBase.Trigger>

    <DropdownMenuBase.Portal>
      <DropdownMenuBase.Content
        className={clsx(dropdownMenuClasses.dropdownMenuContent)}
        sideOffset={5}
      >
        {items.map((item) => (
          <DropdownMenuBase.Item
            key={item.value}
            className={clsx(
              dropdownMenuClasses.dropdownMenuItem,
              item.value === value && dropdownMenuClasses.active,
            )}
            onClick={() => onChange(item.value)}
          >
            <div className={clsx(dropdownMenuClasses.content)}>
              {item.label}

              {item.icon && (
                <div className={clsx(dropdownMenuClasses.icon)}>
                  {item.icon}
                </div>
              )}
            </div>
          </DropdownMenuBase.Item>
        ))}
      </DropdownMenuBase.Content>
    </DropdownMenuBase.Portal>
  </DropdownMenuBase.Root>
);
