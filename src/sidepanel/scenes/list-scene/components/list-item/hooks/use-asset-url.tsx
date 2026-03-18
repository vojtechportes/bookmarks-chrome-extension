import { useEffect, useMemo } from 'react';
import { useGetAsset } from '../../../../../hooks/use-get-asset';

export interface IUseAssetUrlResult {
  assetUrl: string | undefined;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export const useAssetUrl = (
  assetId?: string,
  defaultAssetUrl?: string,
): IUseAssetUrlResult => {
  const { asset, isLoading, error, reload } = useGetAsset(assetId);
  const blob = asset?.blob;

  const objectUrl = useMemo(() => {
    if (!blob) {
      return undefined;
    }

    return URL.createObjectURL(blob);
  }, [blob]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return {
    assetUrl: objectUrl ?? defaultAssetUrl,
    isLoading,
    error,
    reload,
  };
};
