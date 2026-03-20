export interface IBookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  iconAssetId?: string;
  lightIconAssetId?: string;
  darkIconAssetId?: string;
  screenshotAssetId?: string;
  description: string | null;
  addedAt: string;
  updatedAt: string;
  pinned?: boolean;
  isGeneratingDescription?: boolean;
}
