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
  <DropdownMenu
    {...rest}
    trigger={
      <IconButton size="medium" loading={loading}>
        <DotsIcon />
      </IconButton>
    }
  />
);
