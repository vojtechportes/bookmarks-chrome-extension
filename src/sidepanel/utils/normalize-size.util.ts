export const normalizeSize = (
  value: number | string | null,
): string | undefined => {
  if (value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
};
