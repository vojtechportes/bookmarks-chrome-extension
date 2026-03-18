import { useEffect, useState } from 'react';

export interface GoogleDriveAvailability {
  available: boolean;
  connected: boolean;
  email?: string;
}

interface BookmarkResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const getGoogleDriveStatus = async (): Promise<GoogleDriveAvailability> => {
  const response = (await chrome.runtime.sendMessage({
    type: 'GOOGLE_DRIVE_STATUS',
  })) as BookmarkResponse<GoogleDriveAvailability>;

  if (!response.ok || !response.data) {
    throw new Error(response.error ?? 'Failed to get Google Drive status.');
  }

  return response.data;
};

export const useGoogleDriveAvailability = () => {
  const [data, setData] = useState<GoogleDriveAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nextData = await getGoogleDriveStatus();

      setData(nextData);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Unknown error occurred.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return {
    data,
    isLoading,
    error,
    reload: load,
    isGoogleDriveAvailable: data?.available ?? false,
    isGoogleDriveConnected: data?.connected ?? false,
    googleAccountEmail: data?.email,
  };
};
