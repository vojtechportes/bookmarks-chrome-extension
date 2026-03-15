export const isSafeIconUrl = (url: string): boolean =>
  /^(https?:|data:)/i.test(url);
