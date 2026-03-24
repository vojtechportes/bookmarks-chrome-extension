import { useState, type FC } from 'react';
import { Card } from '../../../../components/card/card';
import { Item } from '../../../../components/card/components/item/item';
import type { IBookmarkItem } from '../../../../../shared/types/bookmark-item';
import { clsx } from 'clsx';
import classes from './list-item.module.css';
import { useAssetUrl } from './hooks/use-asset-url';
import { Image } from '../../../../components/card/components/image/image';
import { DATE_TIME_FORMAT } from '../../../../constants/date';
import { format } from 'date-fns';
import type { ViewType } from '../../types/view-type';
import { useHandleDropdownItemClick } from './hooks/use-handle-dropdown-item-click';
import { RenameDialog } from './components/rename-dialog/rename-dialog';
import { Title } from './components/title/title';
import { Description } from './components/description/description';
import { useHandleOpenBookmark } from './hooks/use-handle-open-bookmark';
import { Url } from './components/url/url';

export interface IListItemProps {
  data: IBookmarkItem;
  viewType: ViewType;
  searchTerms?: string[];
  loading?: boolean;
  reload: () => Promise<void>;
}

export const ListItem: FC<IListItemProps> = ({
  data,
  viewType,
  searchTerms = [],
  loading,
  reload,
}) => {
  const {
    id,
    title,
    description,
    url,
    screenshotAssetId,
    pinned,
    addedAt,
    isGeneratingDescription,
  } = data;

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const { assetUrl: screenshotAssetUrl } = useAssetUrl(screenshotAssetId);
  const { handleDropdownItemClick, isLoading: isActionResultLoading } =
    useHandleDropdownItemClick(id, setIsRenameModalOpen);
  const { handleOpenBookmark } = useHandleOpenBookmark(url);

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
        data-test-name="bookmark-item"
        data-test-value={pinned ? 'pinned' : undefined}
      >
        <Title
          data={data}
          loading={isActionResultLoading || !!loading}
          onDropdownItemClick={(value) =>
            handleDropdownItemClick(value, reload)
          }
          searchTerms={searchTerms}
          viewType={viewType}
        />

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

        <Description
          description={description}
          viewType={viewType}
          loading={!!loading}
          isGeneratingDescription={isGeneratingDescription}
        />

        <Url
          url={url}
          searchTerms={searchTerms}
          viewType={viewType}
          loading={!!loading}
        />

        <Item className={clsx(classes.date)} loading={loading}>
          {addedAt ? format(new Date(addedAt), DATE_TIME_FORMAT) : '-'}
        </Item>
      </Card>
    </>
  );
};
