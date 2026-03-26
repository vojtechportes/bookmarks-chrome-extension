import { ensureOffscreenDocument } from './ensure-offscreen-document/ensure-offscreen-document.util';

export const rasterizeSvg = async (blob: Blob): Promise<Blob | undefined> => {
  const arrayBuffer = await blob.arrayBuffer();

  await ensureOffscreenDocument('OFFSCREEN_RASTERIZE_SVG');

  const response = await chrome.runtime.sendMessage({
    target: 'offscreen',
    type: 'OFFSCREEN_RASTERIZE_SVG',
    payload: {
      bytes: Array.from(new Uint8Array(arrayBuffer)),
    },
  });

  if (response.ok) {
    const uint8Array = new Uint8Array(response.bytes);
    const blob = new Blob([uint8Array], { type: response.mimeType });

    return blob;
  }

  return;
};
