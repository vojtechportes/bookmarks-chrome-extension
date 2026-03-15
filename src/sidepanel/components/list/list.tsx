import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './list.module.css';

import type React from 'react';
import { Filters } from './components/filters/filters';
import type { IDropdownMenuProps } from '../dropdown-menu/dropdown-menu';
import type { IViewTypeProps } from './components/filters/components/view-type/view-type';
import type { ISearchProps } from './components/filters/components/search/search';
import { useTranslation } from 'react-i18next';
import { NotFound } from '../not-found/not-found';
import { Stack } from '../stack/stack';
import { Panel } from '../panel/panel';

export interface IListProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  viewTypeProps?: IViewTypeProps;
  searchProps: ISearchProps;
  sortProps: Omit<IDropdownMenuProps, 'trigger'>;
  optionsProps: Omit<IDropdownMenuProps, 'trigger'>;
}

export const List: FC<PropsWithChildren<IListProps>> = ({
  loading,
  className,
  viewTypeProps = { variant: 'tiles' },
  searchProps,
  sortProps,
  optionsProps,
  children,
  ...rest
}) => {
  const { t } = useTranslation();
  const { numberMatches } = searchProps;

  return (
    <>
      <Filters
        loading={loading}
        viewTypeProps={viewTypeProps}
        searchProps={searchProps}
        sortProps={sortProps}
        optionsProps={optionsProps}
        className={clsx(classes.filters)}
      />

      {searchProps.numberMatches === 0 ? (
        <Stack gap={8}>
          <Panel fullHeight align="center">
            <NotFound
              title={t('no-match.title')}
              alt={t('no-match.title')}
              buttonTitle={t('no-match.button-title')}
              slots={{
                button: {
                  onClick: () => searchProps.onChange(''),
                },
              }}
            />
          </Panel>
        </Stack>
      ) : (
        <>
          {searchProps.value !== '' && (
            <div className={clsx(classes.numberMatches)}>
              {t('matched-records', { count: numberMatches })}
            </div>
          )}

          <div
            className={clsx(
              classes.list,
              viewTypeProps.variant && classes[`view-${viewTypeProps.variant}`],
              className,
            )}
            {...rest}
          >
            {children}
          </div>
        </>
      )}
    </>
  );
};
