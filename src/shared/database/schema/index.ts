import type { DBSchema } from 'idb';
import type { IBookmarkItem } from '../../types/bookmark-item';
import type { IAssetItem } from '../../types/asset-item';

export interface BookmarksDbSchema extends DBSchema {
  bookmarks: {
    key: string;
    value: IBookmarkItem;
    indexes: {
      'by-url': string;
    };
  };
  assets: {
    key: string;
    value: IAssetItem;
  };
}
