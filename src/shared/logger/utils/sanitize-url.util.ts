export const sanitizeUrl = (url: string): string => {
  try {
    const sanitizedUrl = new URL(url);

    sanitizedUrl.search = '';
    sanitizedUrl.hash = '';

    return sanitizedUrl.toString();
  } catch {
    return 'Invalid URL';
  }
};
