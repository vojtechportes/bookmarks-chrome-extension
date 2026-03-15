export const getIsDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;
