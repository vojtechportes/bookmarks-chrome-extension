import { ToggleGroup } from "radix-ui";
import toggleGroupClasses from "../../../../../toggle-group/toggle-group.module.css"
import ListViewIcon from "../../../../../icons/list-view-icon.svg?react";
import TileViewIcon from "../../../../../icons/tile-view-icon.svg?react";
import type { FC } from "react";

export type ListVariantType = "list" | "tiles";

export interface IViewTypeProps {
  variant?: ListVariantType
  onChange?: (value: ListVariantType) => void;
}

export const ViewType: FC<IViewTypeProps> = ({ variant = "tiles", onChange }) => {
  return (
    <ToggleGroup.Root
      type="single"
      unselectable="on"
      value={variant}
      className={toggleGroupClasses.toggleGroup}
      onValueChange={onChange}
    >
      <ToggleGroup.Item value="tiles" className={toggleGroupClasses.item}>
        <TileViewIcon width={18} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="list" className={toggleGroupClasses.item}>
        <ListViewIcon width={24} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
