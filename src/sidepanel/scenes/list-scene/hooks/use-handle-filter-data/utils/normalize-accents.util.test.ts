import { describe, expect, it } from 'vitest';
import { normalizeAccents } from './normalize-accents.util';

describe('normalizeAccents', () => {
  it('it lowercases input string and removes bookmarks', () => {
    expect(normalizeAccents('Ondřej')).toBe('ondrej');
  });
});
