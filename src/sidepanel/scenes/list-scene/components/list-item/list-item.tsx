import { useCallback, useMemo, useState, type FC } from 'react';
import Highlighter from 'react-highlight-words';
import { Card } from '../../../../components/card/card';
import { Title } from '../../../../components/card/components/title/title';
import { Item } from '../../../../components/card/components/item/item';
import type { IBookmarkItem } from '../../../../../shared/types/bookmark-item';
import { clsx } from 'clsx';
import classes from './list-item.module.css';
import { IconButton } from '../../../../components/icon-button/icon-button';
import DotsIcon from '../../../../components/icons/dots-icon.svg?react';
import DeleteIcon from '../../../../components/icons/delete-icon.svg?react';
import PinIcon from '../../../../components/icons/pin-icon.svg?react';
import UnpinIcon from '../../../../components/icons/unpin-icon.svg?react';
import RenameIcon from '../../../../components/icons/rename-icon.svg?react';
import {
  DropdownMenu,
  type IDropdownMenuItem,
} from '../../../../components/dropdown-menu/dropdown-menu';
import { runtimeApi } from '../../../../api/runtime-api/runtime-api';
import { useAssetUrl } from './hooks/use-asset-url';
import { Image } from '../../../../components/card/components/image/image';
import { useAlert } from '../../../../components/alert-provider/hooks/use-alert';
import { useTranslation } from 'react-i18next';
import { DATE_TIME_FORMAT } from '../../../../constants/date';
import { format } from 'date-fns';
import type { ViewType } from '../../types/view-type';
import { useIconUrl } from './hooks/use-icon-url';
import { useHandleDropdownItemClick } from './hooks/use-handle-dropdown-item-click';
import { useDarkMode } from '../../../../hooks/use-dark-mode';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../../../shared/constants/error-messages';
import { RenameDialog } from '../rename-dialog/rename-dialog';

export interface IListItemProps {
  data: IBookmarkItem;
  viewType: ViewType;
  searchValue?: string;
  loading?: boolean;
  reload: () => Promise<void>;
}

export const ListItem: FC<IListItemProps> = ({
  data,
  viewType,
  searchValue = '',
  loading,
  reload,
}) => {
  const {
    id,
    title,
    description,
    url,
    iconAssetId,
    darkIconAssetId,
    lightIconAssetId,
    screenshotAssetId,
    pinned,
    addedAt,
  } = data;

  const { t } = useTranslation();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const { error } = useAlert();
  const isDark = useDarkMode();
  const { assetUrl: screenshotAssetUrl } = useAssetUrl(screenshotAssetId);
  const { iconUrl } = useIconUrl(
    iconAssetId,
    darkIconAssetId,
    lightIconAssetId,
  );

  const { handleDropdownItemClick, isLoading: isActionResultLoading } =
    useHandleDropdownItemClick(id, setIsRenameModalOpen);

  const dropdownItems = useMemo<IDropdownMenuItem[]>(
    () => [
      {
        value: pinned ? 'unpin' : 'pin',
        label: t(pinned ? 'unpin' : 'pin'),
        icon: pinned ? <UnpinIcon /> : <PinIcon />,
      },
      {
        value: 'rename',
        label: t('rename'),
        icon: <RenameIcon />,
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

  const handleOpenBookmark = useCallback(
    async (event: React.MouseEvent) => {
      try {
        const element = event.target as HTMLElement;

        if (
          element.closest(
            'button, [role="menuitem"], [role="menu"], .safe-area',
          )
        ) {
          return;
        }

        const response = await runtimeApi.openBookmark(url);

        if (!response.ok) {
          error(t(`error-messages.${response.error}`));
        }
      } catch {
        error(t(`error-messages.${UNSUPPORTED_MESSAGE_TYPE}`));
      }
    },
    [url, error, t],
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
    <>
      <RenameDialog
        onCancel={() => setIsRenameModalOpen(false)}
        open={isRenameModalOpen}
        data={data}
        reload={reload}
      />

      <Card
        className={clsx(classes.card)}
        highlighted={pinned}
        viewType={viewType}
        clickable
        onClick={handleOpenBookmark}
        loading={loading}
      >
        <Title
          viewType={viewType}
          className={clsx(classes.title)}
          endAdornment={
            <div className={clsx(classes.endAdornment)}>
              <div className={clsx(classes.icon)}>
                {iconUrl && !loading && <img src={iconUrl} alt={title} />}
              </div>

              <DropdownMenu
                items={dropdownItems}
                onChange={(value) => handleDropdownItemClick(value, reload)}
                sideOffset={-4}
                trigger={
                  <div
                    className={clsx(classes.iconButtonContainer, 'safe-area')}
                  >
                    <IconButton
                      size="small"
                      apperance="outlined"
                      transparent
                      loading={isActionResultLoading || loading}
                      slots={{
                        skeleton: {
                          variant: isDark ? 'light' : 'dark',
                        },
                      }}
                      className={clsx(classes.noShadow)}
                    >
                      <DotsIcon />
                    </IconButton>
                  </div>
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
              src={screenshotAssetUrl ?? ''}
              alt={title}
              className={clsx(classes.image)}
              viewType={viewType}
              loading={loading}
            />
          )}
        </div>

        <div>
          {viewType === 'tiles' && (
            <Item className={clsx(classes.firstItem)} loading={loading}>
              {description}
            </Item>
          )}
        </div>

        <Item
          className={clsx(
            viewType === 'list' && classes.firstItem,
            classes.link,
          )}
          loading={loading}
        >
          {renderHighlightedText(url)}
        </Item>

        <Item className={clsx(classes.date)} loading={loading}>
          {addedAt ? format(new Date(addedAt), DATE_TIME_FORMAT) : '-'}
        </Item>
      </Card>
    </>
  );
};
