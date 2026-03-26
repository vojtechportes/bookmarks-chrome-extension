export const rasterizeSvg = async (
  blob: Blob,
  sendResponse: (response?: unknown) => void,
  size = 48,
) => {
  if (blob.type !== 'image/svg+xml') {
    sendResponse({ ok: false });
    return;
  }

  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.decoding = 'async';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      sendResponse({ ok: false });
      return;
    }

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result) {
          reject(new Error('Failed to export PNG'));
          return;
        }

        resolve(result);
      }, 'image/png');
    });

    const bytes = Array.from(new Uint8Array(await pngBlob.arrayBuffer()));

    sendResponse({
      ok: true,
      bytes,
      mimeType: 'image/png',
    });
  } catch {
    sendResponse({ ok: false });
  } finally {
    URL.revokeObjectURL(url);
  }
};
