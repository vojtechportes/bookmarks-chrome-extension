import SortIcon from '../../../../../icons/sort-icon.svg?react';
import type { FC, PropsWithChildren } from 'react';
import { IconButton } from '../../../../../icon-button/icon-button';
import {
  DropdownMenu,
  type IDropdownMenuProps,
} from '../../../../../dropdown-menu/dropdown-menu';

export type SortProps = Omit<IDropdownMenuProps, 'trigger'>;

export const Sort: FC<PropsWithChildren<SortProps>> = (props) => (
  <DropdownMenu
    {...props}
    trigger={
      <IconButton size="medium">
        <SortIcon />
      </IconButton>
    }
  />
);
