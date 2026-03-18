/// <reference types="chrome-types" />

type AuthTokenResult = string | { token?: string } | undefined;

const getTokenValue = (result: AuthTokenResult): string | undefined => {
  if (!result) {
    return undefined;
  }

  if (typeof result === 'string') {
    return result;
  }

  return result.token;
};

export interface GoogleDriveAvailability {
  available: boolean;
  connected: boolean;
  email?: string;
}

export const getGoogleDriveAvailability =
  async (): Promise<GoogleDriveAvailability> => {
    const profile = await chrome.identity.getProfileUserInfo();

    if (!profile.email) {
      return {
        available: false,
        connected: false,
      };
    }

    try {
      const tokenResult = await chrome.identity.getAuthToken({
        interactive: false,
      });

      return {
        available: true,
        connected: Boolean(getTokenValue(tokenResult)),
        email: profile.email,
      };
    } catch {
      return {
        available: true,
        connected: false,
        email: profile.email,
      };
    }
  };

export const connectGoogleDrive =
  async (): Promise<GoogleDriveAvailability> => {
    const profile = await chrome.identity.getProfileUserInfo();

    if (!profile.email) {
      return {
        available: false,
        connected: false,
      };
    }

    const tokenResult = await chrome.identity.getAuthToken({
      interactive: true,
    });

    return {
      available: true,
      connected: Boolean(getTokenValue(tokenResult)),
      email: profile.email,
    };
  };

export const getGoogleDriveAccessToken = async (): Promise<string> => {
  const tokenResult = await chrome.identity.getAuthToken({
    interactive: false,
  });

  const token = getTokenValue(tokenResult);

  if (!token) {
    throw new Error('Google Drive is not connected.');
  }

  return token;
};
