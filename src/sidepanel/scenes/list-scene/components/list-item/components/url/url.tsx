import type { FC } from 'react';
import type { ViewType } from '../../../../types/view-type';
import { useRenderHighlightedText } from '../../hooks/use-render-higglighted-text';
import { Item } from '../../../../../../components/card/components/item/item';
import { truncate } from '../../../../../../../shared/utils/truncate.util';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import classes from './url.module.css';
import { CopyButton } from '../../../../../../components/copy-button/copy-button';

export interface IUrlProps {
  url: string;
  viewType: ViewType;
  searchTerms?: string[];
  loading: boolean;
}

export const Url: FC<IUrlProps> = ({ url, searchTerms, viewType, loading }) => {
  const { t } = useTranslation(['bookmarks-scene', 'common']);
  const { renderHighlightedText } = useRenderHighlightedText(searchTerms);

  return (
    <Item
      className={clsx(classes.root, viewType === 'list' && classes.firstItem)}
      loading={loading}
      aria-label={url}
    >
      <span>{renderHighlightedText(truncate(url))}</span>
      &nbsp;
      <CopyButton
        value={url}
        slots={{
          iconButton: {
            size: 'small',
            variant: 'faux',
          },
        }}
        className={clsx(classes.copyButton)}
        successMessage={t('url-copied-success')}
        errorMessage={t('copying-url-failed')}
        title={t('common:copy')}
      />
    </Item>
  );
};
