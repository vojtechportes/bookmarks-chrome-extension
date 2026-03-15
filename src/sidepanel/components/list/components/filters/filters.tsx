import type { FC, PropsWithChildren } from 'react';
import classes from './filters.module.css';
import { clsx } from 'clsx';
import { Sort, type SortProps } from './components/sort/sort';
import { Options, type OptionsProps } from './components/options/options';
import {
  ViewType,
  type IViewTypeProps,
} from './components/view-type/view-type';
import { Search, type ISearchProps } from './components/search/search';

export interface IFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  className?: string;
  sortProps: SortProps;
  searchProps: ISearchProps;
  optionsProps: OptionsProps;
  viewTypeProps?: IViewTypeProps;
}

export const Filters: FC<PropsWithChildren<IFiltersProps>> = ({
  viewTypeProps = { variant: 'tiles' },
  sortProps,
  searchProps,
  optionsProps,
  className,
  ...rest
}) => (
  <div className={clsx(className)}>
    <div className={clsx(classes.filters)} {...rest}>
      <div className={clsx(classes.container)}>
        <div>
          <ViewType {...viewTypeProps} />
        </div>
      </div>

      <div className={clsx(classes.container)}>
        <Search {...searchProps} />

        <Sort {...sortProps} />

        <Options {...optionsProps} />
      </div>
    </div>
  </div>
);
