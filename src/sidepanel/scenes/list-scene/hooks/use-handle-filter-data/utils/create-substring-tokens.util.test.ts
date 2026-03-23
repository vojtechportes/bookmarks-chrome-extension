import { describe, expect, it } from 'vitest';
import { createSubstringTokens } from './create-substring-tokens.util';

describe('createSubstringTokens', () => {
  it('creates substring tokens that includes both original lowercased tokens and tokens stripped of accents', () => {
    const result = createSubstringTokens('Ondřej');

    expect(result).toContain('řej');
    expect(result).toContain('rej');
    expect(result).toContain('ondřej');
    expect(result).toContain('ondrej');
  });

  it('prevents duplicities', () => {
    const result = createSubstringTokens('Ondřej Ondřej');

    expect(result.filter((item) => item === 'ondřej')).toHaveLength(1);
  });

  it('respects minimum token length', () => {
    const result = createSubstringTokens('Ondřej is a singer', 2);

    expect(result).not.toContain('a');
    expect(result).toContain('ondřej');
  });

  it('respects maximum token length', () => {
    const result = createSubstringTokens('Ondřej is a singer', 2, 3);

    expect(result).not.toContain('ondřej');
    expect(result).toContain('is');
  });
});
