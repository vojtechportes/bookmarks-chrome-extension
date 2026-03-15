import type { FC, PropsWithChildren } from "react";
import type { IDataTest } from "../../../../types/data-test";
import clsx from "clsx";
import classes from "./item.module.css";
import { Typography } from "../../../typography/typography";

export interface IItemProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Item: FC<PropsWithChildren<IItemProps>> = ({
  className,
  loading,
  children,
  startAdornment,
  endAdornment,
}) => {
  return (
    <div className={clsx(classes.item, className)}>
      {startAdornment}
      <Typography loading={loading} noMargin>
        {children}
      </Typography>
      {endAdornment}
    </div>
  );
};
