import SortIcon from '../../../../../icons/sort-icon.svg?react';
import type { FC, PropsWithChildren } from 'react';
import { IconButton } from '../../../../../icon-button/icon-button';
import {
  DropdownMenu,
  type IDropdownMenuProps,
} from '../../../../../dropdown-menu/dropdown-menu';

export interface ISortProps extends Omit<IDropdownMenuProps, 'trigger'> {
  loading?: boolean;
}

export const Sort: FC<PropsWithChildren<ISortProps>> = ({
  loading,
  ...rest
}) => (
  <DropdownMenu
    {...rest}
    trigger={
      <IconButton size="medium" loading={loading}>
        <SortIcon />
      </IconButton>
    }
  />
);
