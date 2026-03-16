import type { FC, PropsWithChildren } from 'react';
import classes from './filters.module.css';
import { clsx } from 'clsx';
import { Sort, type ISortProps } from './components/sort/sort';
import { Options, type IOptionsProps } from './components/options/options';
import {
  ViewType,
  type IViewTypeProps,
} from './components/view-type/view-type';
import { Search, type ISearchProps } from './components/search/search';
import { Skeleton } from '../../../skeleton/skeleton';

export interface IFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  className?: string;
  sortProps: ISortProps;
  searchProps: ISearchProps;
  optionsProps: IOptionsProps;
  viewTypeProps?: IViewTypeProps;
}

export const Filters: FC<PropsWithChildren<IFiltersProps>> = ({
  viewTypeProps = { variant: 'tiles' },
  sortProps,
  searchProps,
  optionsProps,
  className,
  loading,
  ...rest
}) => (
  <div className={clsx(className)}>
    <div className={clsx(classes.filters)} {...rest}>
      <div className={clsx(classes.container)}>
        <div>
          {loading ? (
            <Skeleton width={80} height={32} />
          ) : (
            <ViewType {...viewTypeProps} />
          )}
        </div>
      </div>

      <div className={clsx(classes.container)}>
        <Search {...searchProps} loading={loading} />

        <Sort {...sortProps} loading={loading} />

        <Options {...optionsProps} loading={loading} />
      </div>
    </div>
  </div>
);
