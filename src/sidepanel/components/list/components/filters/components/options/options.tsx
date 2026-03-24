import DotsIcon from '../../../../../icons/dots-icon.svg?react';
import type { FC, PropsWithChildren } from 'react';
import { IconButton } from '../../../../../icon-button/icon-button';
import {
  DropdownMenu,
  type IDropdownMenuProps,
} from '../../../../../dropdown-menu/dropdown-menu';

export interface IOptionsProps extends Omit<IDropdownMenuProps, 'trigger'> {
  loading?: boolean;
}

export const Options: FC<PropsWithChildren<IOptionsProps>> = ({
  loading,
  ...rest
}) => (
  <div data-test-name="options">
    <DropdownMenu
      trigger={
        <IconButton
          size="medium"
          loading={loading}
          data-test-value="dropdown-trigger"
        >
          <DotsIcon />
        </IconButton>
      }
      {...rest}
    />
  </div>
);
