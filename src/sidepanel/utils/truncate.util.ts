export const truncate = (
  value: string,
  length = 100,
  ellipsis = '...',
): string => {
  if (value.length <= length) {
    return value;
  }

  const maxLength = length - ellipsis.length;

  if (maxLength <= 0) {
    return ellipsis;
  }

  const words = value.trim().split(/\s+/);

  // Single long word fallback
  if (words.length === 1) {
    return value.slice(0, maxLength) + ellipsis;
  }

  let result = '';

  for (const word of words) {
    const next = result ? `${result} ${word}` : word;

    if (next.length > maxLength) {
      break;
    }

    result = next;
  }

  // Fallback if first word is too long
  if (!result) {
    return value.slice(0, maxLength) + ellipsis;
  }

  // Remove trailing punctuation
  result = result.replace(/[.,;:!?]$/, '');

  return result + ellipsis;
};
