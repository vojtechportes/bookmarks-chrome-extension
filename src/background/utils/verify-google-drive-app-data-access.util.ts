import { getGoogleDriveAccessToken } from './google-drive.util';

export const verifyGoogleDriveAppDataAccess = async (): Promise<boolean> => {
  const token = await getGoogleDriveAccessToken();

  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=1&fields=files(id,name)',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.ok;
};
