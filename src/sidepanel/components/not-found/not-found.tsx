import type { FC } from "react";
import { useDarkMode } from "../../hooks/use-dark-mode";
import { Typography } from "../typography/typography";
import { Button, type IButtonProps } from "../button/button";
import type { TypographyProps } from "../typography/types";
import clsx from "clsx";
import classes from "./not-found.module.css";
import { Skeleton } from "../skeleton/skeleton";

export interface INotFoundSlots {
  title?: TypographyProps;
  button?: IButtonProps;
}

export interface INotFoundProps {
  title: React.ReactNode;
  buttonTitle: React.ReactNode;
  loading?: boolean;
  slots?: INotFoundSlots;
}

export const NotFound: FC<INotFoundProps> = ({
  title,
  buttonTitle,
  loading,
  slots,
}) => {
  const isDarkMode = useDarkMode();

  return (
    <>
      <Typography
        component="h1"
        as="h3"
        noMargin
        textAlign="center"
        loading={loading}
        {...slots?.title}
      >
        {title}
      </Typography>

      <div className={clsx(classes.image)}>
        {loading ? (
          <Skeleton shape="circle" size="250px" />
        ) : (
          <img
            src={isDarkMode ? "empty-dark-mode.png" : "empty.png"}
            style={{ width: "100%", maxWidth: "420px", height: "auto" }}
          />
        )}
      </div>

      <Button variant="primary" {...slots?.button} loading={loading}>
        {buttonTitle}
      </Button>
    </>
  );
};
