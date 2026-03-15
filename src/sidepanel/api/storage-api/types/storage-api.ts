import type { StorageChange } from './storage-change';
import type { Unsubscribe } from './unsubscribe';

export interface IStorageApi {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  subscribe<T>(
    key: string,
    callback: (change: StorageChange<T>) => void,
  ): Unsubscribe;
}
