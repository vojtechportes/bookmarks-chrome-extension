import { useCallback, useMemo, type FC } from 'react';
import Highlighter from 'react-highlight-words';
import { Card } from '../../../../components/card/card';
import { Title } from '../../../../components/card/components/title/title';
import { Item } from '../../../../components/card/components/item/item';
import type { BookmarkItem } from '../../../../../shared/types/bookmark-item';
import { clsx } from 'clsx';
import classes from './list-item.module.css';
import { IconButton } from '../../../../components/icon-button/icon-button';
import DotsIcon from '../../../../components/icons/dots-icon.svg?react';
import DeleteIcon from '../../../../components/icons/delete-icon.svg?react';
import PinIcon from '../../../../components/icons/pin-icon.svg?react';
import UnpinIcon from '../../../../components/icons/unpin-icon.svg?react';
import {
  DropdownMenu,
  type IDropdownMenuItem,
} from '../../../../components/dropdown-menu/dropdown-menu';
import { runtimeApi } from '../../../../api/runtime-api/runtime-api';
import { useAssetUrl } from './hooks/use-asset-url';
import { Image } from '../../../../components/card/components/image/image';
import type { ViewType } from '../../types';
import { useAlert } from '../../../../components/alert-provider/hooks/use-alert';
import { useTranslation } from 'react-i18next';
import { DATE_TIME_FORMAT } from '../../../../constants/date';
import { format } from 'date-fns';

export interface IListItemProps extends BookmarkItem {
  viewType: ViewType;
  searchValue?: string;
}

export const ListItem: FC<IListItemProps> = ({
  id,
  title,
  description,
  url,
  icon,
  iconAssetId,
  screenshotAssetId,
  pinned,
  addedAt,
  viewType,
  searchValue = '',
}) => {
  const { t } = useTranslation();
  const { success, error } = useAlert();
  const { assetUrl: iconAssetUrl } = useAssetUrl(iconAssetId, icon);
  const { assetUrl: screenshotAssetUrl } = useAssetUrl(
    screenshotAssetId,
    undefined,
  );

  const dropdownItems = useMemo<IDropdownMenuItem[]>(
    () => [
      {
        value: pinned ? 'unpin' : 'pin',
        label: t(pinned ? 'unpin' : 'pin'),
        icon: pinned ? <UnpinIcon /> : <PinIcon />,
      },
      {
        value: 'delete',
        label: t('delete'),
        icon: <DeleteIcon />,
      },
    ],
    [pinned, t],
  );

  const searchWords = useMemo(() => {
    return searchValue
      .trim()
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [searchValue]);

  const handleDropdownItemClick = useCallback(
    async (value: string) => {
      if (value === 'pin') {
        await runtimeApi.pinBookmark(id);
      }

      if (value === 'unpin') {
        await runtimeApi.unpinBookmark(id);
      }

      if (value === 'delete') {
        const response = await runtimeApi.deleteBookmark(id);

        if (!response.ok) {
          error(t(`error-messages.${response.error}`));
          return;
        }

        success(t('succeess-messages.bookmark-deleted'));
      }
    },
    [error, id, success, t],
  );

  const renderHighlightedText = useCallback(
    (value?: string) => {
      const resolvedValue = value ?? '';

      if (!searchWords.length) {
        return resolvedValue;
      }

      return (
        <Highlighter
          searchWords={searchWords}
          textToHighlight={resolvedValue}
          autoEscape
          highlightClassName={classes.highlight}
        />
      );
    },
    [searchWords],
  );

  return (
    <Card
      className={clsx(classes.card)}
      highlighted={pinned}
      viewType={viewType}
      clickable
    >
      <Title
        viewType={viewType}
        className={clsx(classes.title)}
        endAdornment={
          <div className={clsx(classes.endAdornment)}>
            <div className={clsx(classes.icon)}>
              <img src={iconAssetUrl} alt="" />
            </div>

            <DropdownMenu
              items={dropdownItems}
              onChange={handleDropdownItemClick}
              trigger={
                <IconButton size="small" apperance="outlined" transparent>
                  <DotsIcon />
                </IconButton>
              }
            />
          </div>
        }
      >
        {renderHighlightedText(title)}
      </Title>

      <div>
        {screenshotAssetUrl && (
          <Image
            src={screenshotAssetUrl}
            alt={title}
            className={clsx(classes.image)}
            viewType={viewType}
          />
        )}
      </div>

      <div>
        {viewType === 'tiles' && (
          <Item className={clsx(classes.firstItem)}>
            {renderHighlightedText(description ?? '')}
          </Item>
        )}
      </div>

      <Item
        className={clsx(viewType === 'list' && classes.firstItem, classes.link)}
      >
        {renderHighlightedText(url)}
      </Item>

      <Item className={clsx(classes.date)}>
        {addedAt ? format(new Date(addedAt), DATE_TIME_FORMAT) : '-'}
      </Item>
    </Card>
  );
};
