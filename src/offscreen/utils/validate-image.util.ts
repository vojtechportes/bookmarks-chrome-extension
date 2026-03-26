export const validateImage = async (
  blob: Blob,
  sendResponse: (response?: unknown) => void,
) => {
  try {
    const bitmap = await createImageBitmap(blob);

    bitmap.close();

    sendResponse({
      ok: true,
    });
  } catch {
    sendResponse({
      ok: false,
    });
  }
};
