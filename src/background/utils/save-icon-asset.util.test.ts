import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_TO_FETCH_ICON } from '../../shared/constants/error-messages';
import { putAsset } from '../../shared/database/put-asset';
import { compressImageBlob } from './compress-image-blob.util';
import { saveIconAsset } from './save-icon-asset.util';

vi.mock('../../shared/database/put-asset', () => ({
  putAsset: vi.fn(),
}));

vi.mock('./compress-image-blob.util', () => ({
  compressImageBlob: vi.fn(),
}));

describe('saveIconAsset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('throws when icon fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(
      saveIconAsset('bookmark-1', 'https://example.com/favicon.ico'),
    ).rejects.toThrow(FAILED_TO_FETCH_ICON);

    expect(putAsset).not.toHaveBeenCalled();
    expect(compressImageBlob).not.toHaveBeenCalled();
  });

  it('returns undefined when fetched blob is empty', async () => {
    const emptyBlob = new Blob([], { type: 'image/png' });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(emptyBlob),
      }),
    );

    const result = await saveIconAsset(
      'bookmark-1',
      'https://example.com/favicon.ico',
    );

    expect(result).toBeUndefined();
    expect(putAsset).not.toHaveBeenCalled();
    expect(compressImageBlob).not.toHaveBeenCalled();
  });

  it('compresses non-svg icon and stores compressed blob', async () => {
    const originalBlob = new Blob(['original'], { type: 'image/png' });
    const compressedBlob = new Blob(['compressed'], { type: 'image/webp' });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(originalBlob),
      }),
    );

    vi.mocked(compressImageBlob).mockResolvedValue(compressedBlob);
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveIconAsset(
      'bookmark-1',
      'https://example.com/favicon.ico',
    );

    expect(compressImageBlob).toHaveBeenCalledWith(originalBlob, 48, 0.9);
    expect(putAsset).toHaveBeenCalledTimes(1);
    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-icon',
      type: 'favicon',
      mimeType: 'image/webp',
      blob: compressedBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-icon');
  });

  it('falls back to original blob when compression fails', async () => {
    const originalBlob = new Blob(['original'], { type: 'image/png' });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(originalBlob),
      }),
    );

    vi.mocked(compressImageBlob).mockRejectedValue(
      new Error('Compression failed'),
    );
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveIconAsset(
      'bookmark-1',
      'https://example.com/favicon.ico',
    );

    expect(compressImageBlob).toHaveBeenCalledWith(originalBlob, 48, 0.9);
    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-icon',
      type: 'favicon',
      mimeType: 'image/png',
      blob: originalBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-icon');
  });

  it('skips compression for svg icons', async () => {
    const svgBlob = new Blob(
      ['<svg xmlns="http://www.w3.org/2000/svg"></svg>'],
      {
        type: 'image/svg+xml',
      },
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(svgBlob),
      }),
    );

    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveIconAsset(
      'bookmark-1',
      'https://example.com/favicon.svg',
    );

    expect(compressImageBlob).not.toHaveBeenCalled();
    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-icon',
      type: 'favicon',
      mimeType: 'image/svg+xml',
      blob: svgBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-icon');
  });

  it('uses image/png as fallback mime type when original blob type is empty', async () => {
    const originalBlob = new Blob(['original'], { type: '' });
    const compressedBlob = new Blob(['compressed'], { type: 'image/webp' });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(originalBlob),
      }),
    );

    vi.mocked(compressImageBlob).mockResolvedValue(compressedBlob);
    vi.mocked(putAsset).mockResolvedValue(undefined);

    await saveIconAsset('bookmark-1', 'https://example.com/favicon.ico');

    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-icon',
      type: 'favicon',
      mimeType: 'image/webp',
      blob: compressedBlob,
      createdAt: expect.any(String),
    });
  });
});
