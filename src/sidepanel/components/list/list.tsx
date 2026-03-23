import type { FC, PropsWithChildren } from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './list.module.css';
import type React from 'react';
import { Filters } from './components/filters/filters';
import type { IDropdownMenuProps } from '../dropdown-menu/dropdown-menu';
import type { IViewTypeProps } from './components/filters/components/view-type/view-type';
import type { ISearchProps } from './components/filters/components/search/search';
import { useTranslation, Trans } from 'react-i18next';
import { NotFound } from '../not-found/not-found';
import { Stack } from '../stack/stack';
import { Panel } from '../panel/panel';
import { ResetSearch } from './components/reset-search/reset-search';
import { Masonry } from '../masonry/masonry';

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
  const { t } = useTranslation('bookmarks-scene');
  const { numberMatches } = searchProps;

  return (
    <div className={clsx(className)} {...rest}>
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
              <Trans
                i18nKey="matched-records"
                count={numberMatches}
                components={[
                  <ResetSearch onClick={() => searchProps.onChange('')} />,
                ]}
              />
            </div>
          )}

          {viewTypeProps.variant === 'tiles' ? (
            <Masonry>{children}</Masonry>
          ) : (
            <div className={clsx(classes.list)}>{children}</div>
          )}
        </>
      )}
    </div>
  );
};
