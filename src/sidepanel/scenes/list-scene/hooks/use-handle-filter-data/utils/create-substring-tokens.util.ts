import { normalizeAccents } from './normalize-accents.util';
import { splitWords } from './split-words.util';

export const createSubstringTokens = (
  value: string,
  minLength = 2,
  maxLength = 12,
): string[] => {
  const words = splitWords(value);
  const tokens = new Set<string>();

  for (const word of words) {
    const cappedLength = Math.min(word.length, maxLength);

    for (let start = 0; start < word.length; start += 1) {
      for (
        let length = minLength;
        length <= cappedLength && start + length <= word.length;
        length += 1
      ) {
        const originalToken = word.slice(start, start + length);
        const normalizedToken = normalizeAccents(originalToken);

        tokens.add(originalToken);

        if (normalizedToken !== originalToken) {
          tokens.add(normalizedToken);
        }
      }
    }
  }

  return [...tokens];
};
