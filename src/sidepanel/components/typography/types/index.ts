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
  component?: TypographyComponent;
  as?: TypographyComponent;
  noMargin?: boolean;
  textAlign?: React.CSSProperties['textAlign'];
  loading?: boolean;
  slots?: IBaseTypographySlots;
}

type TypographyPropsMap = {
  [K in TypographyComponent]: IBaseTypographyProps & {
    component?: K;
  } & Omit<React.ComponentPropsWithoutRef<K>, keyof IBaseTypographyProps>;
};

export type TypographyProps = TypographyPropsMap[TypographyComponent];
