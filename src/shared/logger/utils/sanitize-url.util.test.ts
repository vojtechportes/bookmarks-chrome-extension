import { describe, expect, it } from 'vitest';
import { sanitizeUrl } from './sanitize-url.util';

describe('sanitizeUrl', () => {
  it('returns sanitized url', () => {
    expect(sanitizeUrl('http://example.com/user?token=TOKEN')).toBe(
      'http://example.com/user',
    );
  });
});
