import type { IStorageApi } from "./types/storage-api";
import type { StorageChange } from "./types/storage-change";
import type { Unsubscribe } from "./types/unsubscribe";

export class ChromeStorageApi implements IStorageApi {
  async get<T>(key: string): Promise<T | undefined> {
    const result = await chrome.storage.local.get([key]);
    return result[key] as T | undefined;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }

  subscribe<T>(
    key: string,
    callback: (change: StorageChange<T>) => void,
  ): Unsubscribe {
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== "local" || !changes[key]) {
        return;
      }

      callback({
        oldValue: changes[key].oldValue as T | undefined,
        newValue: changes[key].newValue as T | undefined,
      });
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }
}
