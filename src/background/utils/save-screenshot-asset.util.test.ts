import { beforeEach, describe, expect, it, vi } from 'vitest';
import { putAsset } from '../../shared/database/put-asset';
import { compressImageBlob } from './compress-image-blob.util';
import { dataUrlToBlob } from './data-url-to-blob.util';
import { saveScreenshotAsset } from './save-screenshot-asset.util';

const mockCaptureVisibleTab = (value: string | undefined) => {
  const mock = vi.fn().mockResolvedValue(value);
  chrome.tabs.captureVisibleTab = mock;
  return mock;
};

vi.mock('../../shared/database/put-asset', () => ({
  putAsset: vi.fn(),
}));

vi.mock('./compress-image-blob.util', () => ({
  compressImageBlob: vi.fn(),
}));

vi.mock('./data-url-to-blob.util', () => ({
  dataUrlToBlob: vi.fn(),
}));

describe('saveScreenshotAsset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns undefined when captureVisibleTab returns no data url', async () => {
    const captureVisibleTabMock = mockCaptureVisibleTab(undefined);

    const result = await saveScreenshotAsset('bookmark-1');

    expect(captureVisibleTabMock).toHaveBeenCalledWith(undefined, {
      format: 'png',
    });
    expect(dataUrlToBlob).not.toHaveBeenCalled();
    expect(compressImageBlob).not.toHaveBeenCalled();
    expect(putAsset).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('returns undefined when converted blob is empty', async () => {
    const captureVisibleTabMock = mockCaptureVisibleTab(
      'data:image/png;base64,abc123',
    );

    vi.mocked(dataUrlToBlob).mockResolvedValue(
      new Blob([], { type: 'image/png' }),
    );

    const result = await saveScreenshotAsset('bookmark-1');

    expect(captureVisibleTabMock).toHaveBeenCalledWith(undefined, {
      format: 'png',
    });
    expect(dataUrlToBlob).toHaveBeenCalledWith('data:image/png;base64,abc123');
    expect(compressImageBlob).not.toHaveBeenCalled();
    expect(putAsset).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('compresses screenshot and stores compressed blob', async () => {
    const originalBlob = new Blob(['original'], { type: 'image/png' });
    const compressedBlob = new Blob(['compressed'], { type: 'image/webp' });

    const captureVisibleTabMock = mockCaptureVisibleTab(
      'data:image/png;base64,abc123',
    );

    vi.mocked(dataUrlToBlob).mockResolvedValue(originalBlob);
    vi.mocked(compressImageBlob).mockResolvedValue(compressedBlob);
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveScreenshotAsset('bookmark-1');

    expect(captureVisibleTabMock).toHaveBeenCalledWith(undefined, {
      format: 'png',
    });
    expect(dataUrlToBlob).toHaveBeenCalledWith('data:image/png;base64,abc123');
    expect(compressImageBlob).toHaveBeenCalledWith(originalBlob, 600, 0.8);
    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-screenshot',
      type: 'screenshot',
      mimeType: 'image/webp',
      blob: compressedBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-screenshot');
  });

  it('falls back to original blob when compression fails', async () => {
    const originalBlob = new Blob(['original'], { type: 'image/png' });

    mockCaptureVisibleTab('data:image/png;base64,abc123');

    vi.mocked(dataUrlToBlob).mockResolvedValue(originalBlob);
    vi.mocked(compressImageBlob).mockRejectedValue(
      new Error('Compression failed'),
    );
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveScreenshotAsset('bookmark-1');

    expect(compressImageBlob).toHaveBeenCalledWith(originalBlob, 600, 0.8);
    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-screenshot',
      type: 'screenshot',
      mimeType: 'image/png',
      blob: originalBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-screenshot');
  });

  it('uses image/png as initial fallback mime type when original blob type is empty', async () => {
    const originalBlob = new Blob(['original'], { type: '' });
    const compressedBlob = new Blob(['compressed'], { type: 'image/webp' });

    mockCaptureVisibleTab('data:image/png;base64,abc123');

    vi.mocked(dataUrlToBlob).mockResolvedValue(originalBlob);
    vi.mocked(compressImageBlob).mockResolvedValue(compressedBlob);
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveScreenshotAsset('bookmark-1');

    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-screenshot',
      type: 'screenshot',
      mimeType: 'image/webp',
      blob: compressedBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-screenshot');
  });

  it('keeps original fallback mime type when compression fails and blob type is empty', async () => {
    const originalBlob = new Blob(['original'], { type: '' });

    mockCaptureVisibleTab('data:image/png;base64,abc123');

    vi.mocked(dataUrlToBlob).mockResolvedValue(originalBlob);
    vi.mocked(compressImageBlob).mockRejectedValue(
      new Error('Compression failed'),
    );
    vi.mocked(putAsset).mockResolvedValue(undefined);

    const result = await saveScreenshotAsset('bookmark-1');

    expect(putAsset).toHaveBeenCalledWith({
      id: 'bookmark-1-screenshot',
      type: 'screenshot',
      mimeType: 'image/png',
      blob: originalBlob,
      createdAt: expect.any(String),
    });
    expect(result).toBe('bookmark-1-screenshot');
  });
});
