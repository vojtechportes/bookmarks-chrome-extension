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
  <div data-test-name="sort">
    <DropdownMenu
      {...rest}
      trigger={
        <IconButton
          size="medium"
          data-test-value="dropdown-trigger"
          loading={loading}
        >
          <SortIcon />
        </IconButton>
      }
    />
  </div>
);
