import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import classes from "./panel.module.css";
import type { IDataTest } from "../../types/data-test";

export interface IPanelProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  fullHeight?: boolean;
  transparent?: boolean;
  align?: "left" | "center" | "right";
}

export const Panel: FC<PropsWithChildren<IPanelProps>> = ({
  children,
  fullHeight,
  transparent,
  align = "center",
  className,
  ...rest
}) => (
  <div
    className={clsx(
      classes.panel,
      classes?.[align],
      fullHeight && classes.fullHeight,
      transparent && classes.transparent,
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
