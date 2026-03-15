import type { IStorageApi } from './types/storage-api';
import type { StorageChange } from './types/storage-change';
import type { Unsubscribe } from './types/unsubscribe';

export class BrowserStorageApi implements IStorageApi {
  private listeners = new Map<
    string,
    Set<(change: StorageChange<unknown>) => void>
  >();

  async get<T>(key: string): Promise<T | undefined> {
    const rawValue = window.localStorage.getItem(key);

    if (rawValue == null) {
      return undefined;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return undefined;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const previousValue = await this.get<T>(key);

    window.localStorage.setItem(key, JSON.stringify(value));

    const listenersForKey = this.listeners.get(key);

    if (!listenersForKey) {
      return;
    }

    for (const listener of listenersForKey) {
      listener({
        oldValue: previousValue,
        newValue: value,
      });
    }
  }

  subscribe<T>(
    key: string,
    callback: (change: StorageChange<T>) => void,
  ): Unsubscribe {
    const wrappedCallback = callback as (
      change: StorageChange<unknown>,
    ) => void;

    const existing = this.listeners.get(key) ?? new Set();

    existing.add(wrappedCallback);

    this.listeners.set(key, existing);

    return () => {
      const listenersForKey = this.listeners.get(key);

      if (!listenersForKey) {
        return;
      }

      listenersForKey.delete(wrappedCallback);

      if (listenersForKey.size === 0) {
        this.listeners.delete(key);
      }
    };
  }
}
