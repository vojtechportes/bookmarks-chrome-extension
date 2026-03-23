import { describe, expect, it } from 'vitest';
import { splitWords } from './split-words.util';

describe('splitWords', () => {
  it('it splits and lowercases input string and outputs array of words', () => {
    expect(splitWords('Ondřej is a singer')).toEqual([
      'ondřej',
      'is',
      'a',
      'singer',
    ]);
  });
});
