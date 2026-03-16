import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openDatabase } from './open-database.util';

describe('openDatabase', () => {
  const openMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(globalThis, 'indexedDB', {
      value: {
        open: openMock,
      },
      configurable: true,
    });
  });

  it('opens database and resolves on success', async () => {
    const mockDb = {
      close: vi.fn(),
      objectStoreNames: { contains: () => true },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = {};

    openMock.mockReturnValue(request);

    const promise = openDatabase();

    request.result = mockDb;
    request.onsuccess();

    const db = await promise;

    expect(openMock).toHaveBeenCalled();
    expect(db).toBe(mockDb);
  });
});
