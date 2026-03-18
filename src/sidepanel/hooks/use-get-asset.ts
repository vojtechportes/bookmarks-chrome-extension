import { useCallback, useEffect, useState } from 'react';
import { getAssetById } from '../../shared/database/api/assets/get-asset-by-id';
import type { IAssetItem } from '../../shared/types/asset-item';

export interface IUseGetAssetResult {
  asset: IAssetItem | undefined;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export const useGetAsset = (assetId?: string): IUseGetAssetResult => {
  const [asset, setAsset] = useState<IAssetItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(Boolean(assetId));
  const [error, setError] = useState<Error | null>(null);

  const loadAsset = useCallback(async () => {
    if (!assetId) {
      setAsset(undefined);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getAssetById(assetId);
      setAsset(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('Failed to load asset'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    void loadAsset();
  }, [loadAsset]);

  return {
    asset,
    isLoading,
    error,
    reload: loadAsset,
  };
};
