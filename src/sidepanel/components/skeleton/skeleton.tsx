import { useMemo, type FC } from "react";
import type { ISkeletonProps } from "./types";
import clsx from "clsx";
import classes from "./skeleton.module.css";
import { normalizeSize } from "../../utils/normalize-size.util";

export const Skeleton: FC<ISkeletonProps> = ({
  shape = "rectangle",
  size = 50,
  width = "100%",
  height = 20,
  className,
}) => {
  const styles = useMemo((): React.CSSProperties => {
    if (shape === "rectangle") {
      return {
        width: normalizeSize(width),
        height: normalizeSize(height),
      };
    }

    return {
      width: normalizeSize(size),
      height: normalizeSize(size),
    };
  }, [shape, size, width, height]);

  return (
    <div
      className={clsx(classes.skeleton, classes[shape], className)}
      style={styles}
    />
  );
};
