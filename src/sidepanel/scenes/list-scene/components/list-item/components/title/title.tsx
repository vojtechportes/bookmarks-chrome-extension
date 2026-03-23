import { useMemo, type FC } from 'react';
import { Title as TitleBase } from '../../../../../../components/card/components/title/title';
import { IconButton } from '../../../../../../components/icon-button/icon-button';
import { useDarkMode } from '../../../../../../hooks/use-dark-mode';
import {
  DropdownMenu,
  type IDropdownMenuItem,
} from '../../../../../../components/dropdown-menu/dropdown-menu';
import DotsIcon from '../../../../../../components/icons/dots-icon.svg?react';
import DeleteIcon from '../../../../../../components/icons/delete-icon.svg?react';
import PinIcon from '../../../../../../components/icons/pin-icon.svg?react';
import UnpinIcon from '../../../../../../components/icons/unpin-icon.svg?react';
import RenameIcon from '../../../../../../components/icons/rename-icon.svg?react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import type { ViewType } from '../../../../types/view-type';
import classes from './title.module.css';
import { useRenderHighlightedText } from '../../hooks/use-render-higglighted-text';
import type { IBookmarkItem } from '../../../../../../../shared/types/bookmark-item';
import { useIconUrl } from '../../hooks/use-icon-url';

export interface ITitleProps {
  data: IBookmarkItem;
  loading: boolean;
  viewType: ViewType;
  onDropdownItemClick: (value: string) => void;
  searchTerms?: string[];
}

export const Title: FC<ITitleProps> = ({
  data,
  loading,
  viewType,
  searchTerms,
  onDropdownItemClick,
}) => {
  const { title, pinned, iconAssetId, darkIconAssetId, lightIconAssetId } =
    data;

  const { t } = useTranslation(['bookmarks-scene', 'common']);
  const isDark = useDarkMode();
  const { renderHighlightedText } = useRenderHighlightedText(searchTerms);

  const { iconUrl } = useIconUrl(
    iconAssetId,
    darkIconAssetId,
    lightIconAssetId,
  );

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

  return (
    <TitleBase
      viewType={viewType}
      className={clsx(classes.root)}
      endAdornment={
        <div className={clsx(classes.endAdornment)}>
          <div className={clsx(classes.icon)}>
            {iconUrl && !loading && <img src={iconUrl} alt={title} />}
          </div>

          <div>
            <DropdownMenu
              items={dropdownItems}
              onChange={onDropdownItemClick}
              sideOffset={0}
              trigger={
                <div className={clsx(classes.iconButtonContainer, 'safe-area')}>
                  <IconButton
                    size="small"
                    apperance="outlined"
                    transparent
                    loading={loading}
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
        </div>
      }
    >
      {renderHighlightedText(title)}
    </TitleBase>
  );
};
