export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  iconAssetId?: string;
  screenshotAssetId?: string;
  description: string | null;
  addedAt: string;
  pinned?: boolean;
}
