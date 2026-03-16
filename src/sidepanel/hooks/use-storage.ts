import { useEffect, useState } from 'react';
import { storageApi } from '../api/storage-api/storage-api';

export const useStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Prevents updating React state if the async storage read
     * finishes after the component has been unmounted.
     */
    let isMounted = true;

    const loadValue = async () => {
      try {
        const storedValue = await storageApi.get<T>(key);

        if (!isMounted) {
          return;
        }

        if (storedValue !== undefined) {
          setValue(storedValue);
        } else {
          setValue(defaultValue);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadValue();

    const unsubscribe = storageApi.subscribe<T>(key, (change) => {
      if (change.newValue !== undefined) {
        setValue(change.newValue);
      } else {
        setValue(defaultValue);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [key, defaultValue]);

  const updateValue = async (nextValue: T) => {
    setValue(nextValue);
    await storageApi.set(key, nextValue);
  };

  return { value, setValue: updateValue, loading };
};
