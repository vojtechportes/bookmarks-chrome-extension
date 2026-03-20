import type { IDataTest } from '../../../types/data-test';
import type { IRectangleSkeletonProps } from '../../skeleton/types';

export type TypographyComponent =
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5';

export interface IBaseTypographySlots {
  skeleton?: Omit<IRectangleSkeletonProps, 'shape'>;
}

export interface IBaseTypographyProps extends IDataTest {
  as?: TypographyComponent;
  noMargin?: boolean;
  textAlign?: React.CSSProperties['textAlign'];
  loading?: boolean;
  loadingEndAdornment?: React.ReactNode;
  loadingStartAdornment?: React.ReactNode;
  slots?: IBaseTypographySlots;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

type ConditionalSize<K extends TypographyComponent> = K extends 'p'
  ? { size?: 'normal' | 'small' }
  : { size?: never };

export type TypographyProps<K extends TypographyComponent = 'p'> =
  IBaseTypographyProps & {
    component?: K;
  } & ConditionalSize<K> &
    Omit<
      React.ComponentPropsWithoutRef<K>,
      keyof IBaseTypographyProps | 'component' | 'size'
    >;
