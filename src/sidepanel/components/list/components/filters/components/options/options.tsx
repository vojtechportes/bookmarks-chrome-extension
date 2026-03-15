import DotsIcon from "../../../../../icons/dots-icon.svg?react";
import type { FC, PropsWithChildren } from "react";
import { IconButton } from "../../../../../icon-button/icon-button";
import {
  DropdownMenu,
  type IDropdownMenuProps,
} from "../../../../../dropdown-menu/dropdown-menu";

export type OptionsProps = Omit<IDropdownMenuProps, "trigger">;

export const Options: FC<PropsWithChildren<OptionsProps>> = (props) => (
  <DropdownMenu
    {...props}
    trigger={
      <IconButton size="medium">
        <DotsIcon />
      </IconButton>
    }
  />
);
