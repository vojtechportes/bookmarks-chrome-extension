import { useMemo } from 'react';
import { useDarkMode } from '../../../../../hooks/use-dark-mode';
import { useAssetUrl } from './use-asset-url';

export const useIconUrl = (
  iconAssetId?: string,
  darkIconAssetId?: string,
  lightIconAssetId?: string,
) => {
  const { assetUrl: iconAssetUrl } = useAssetUrl(iconAssetId);
  const { assetUrl: darkIconAssetUrl } = useAssetUrl(darkIconAssetId);
  const { assetUrl: lightIconAssetUrl } = useAssetUrl(lightIconAssetId);
  const isDarkMode = useDarkMode();

  const iconUrl = useMemo(() => {
    if (isDarkMode) {
      return darkIconAssetUrl ?? lightIconAssetUrl ?? iconAssetUrl;
    }

    return lightIconAssetUrl ?? darkIconAssetUrl ?? iconAssetUrl;
  }, [darkIconAssetUrl, lightIconAssetUrl, iconAssetUrl, isDarkMode]);

  return { iconUrl };
};
