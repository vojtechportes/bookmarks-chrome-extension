import { useEffect, useState } from "react";
import { getAsset } from "../../../../../../shared/database/get-asset";

export const useAssetUrl = (assetId?: string, defaultAssetUrl?: string) => {
  const [assetUrl, setAssetUrl] = useState<string | undefined>(defaultAssetUrl);

  useEffect(() => {
    let objectUrl: string | undefined;

    const loadAsset = async () => {
      if (!assetId) {
        return;
      }

      const blob = await getAsset(assetId);

      if (!blob) {
        return;
      }

      objectUrl = URL.createObjectURL(blob);
      setAssetUrl(objectUrl);
    };

    void loadAsset();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [assetId]);

  return { assetUrl, setAssetUrl };
};
