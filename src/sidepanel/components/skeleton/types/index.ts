interface IBaseSkeletonProps {
  shape?: "rectangle" | "circle";
  className?: string;
}

interface ICircleSkeletonProps extends IBaseSkeletonProps {
  shape: "circle";
  size?: number | string | null;
  width?: never;
  height?: never;
}

interface IRectangleSkeletonProps extends IBaseSkeletonProps {
  shape?: "rectangle";
  width?: number | string | null;
  height?: number | string | null;
  size?: never;
}

export type ISkeletonProps = ICircleSkeletonProps | IRectangleSkeletonProps;