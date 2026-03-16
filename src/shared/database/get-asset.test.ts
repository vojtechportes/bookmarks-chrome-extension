import { describe, it, expect, vi } from 'vitest';
import { putAsset } from './put-asset';
import { openDatabase } from './utils/open-database.util';

vi.mock('./utils/open-database.util', () => ({
  openDatabase: vi.fn(),
}));

describe('putAsset', () => {
  it('stores asset and closes database', async () => {
    const put = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction: Record<string, any> = {
      objectStore: vi.fn(() => ({ put })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const database: any = {
      transaction: vi.fn(() => transaction),
      close: vi.fn(),
    };

    vi.mocked(openDatabase).mockResolvedValue(database);

    const asset = {
      id: '1',
      type: 'favicon' as const,
      mimeType: 'image/png',
      blob: new Blob(['test']),
      createdAt: new Date().toISOString(),
    };

    const promise = putAsset(asset);

    await Promise.resolve();

    transaction.oncomplete();

    await promise;

    expect(put).toHaveBeenCalledWith(asset);
    expect(database.close).toHaveBeenCalled();
  });
});
