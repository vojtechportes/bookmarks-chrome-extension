export const splitWords = (value: string): string[] => {
  return value
    .toLowerCase()
    .trim()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
};
