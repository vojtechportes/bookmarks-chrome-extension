import { describe, expect, it } from 'vitest';
import { isBookmarkableUrl } from './is-bookmarkable-url.util';

describe('isBookmarkableUrl', () => {
  it('returns true for http urls', () => {
    expect(isBookmarkableUrl('http://example.com')).toBe(true);
  });

  it('returns true for https urls', () => {
    expect(isBookmarkableUrl('https://example.com')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(isBookmarkableUrl('HTTPS://example.com')).toBe(true);
    expect(isBookmarkableUrl('HTTP://example.com')).toBe(true);
  });

  it('returns false for non-http protocols', () => {
    expect(isBookmarkableUrl('chrome://extensions')).toBe(false);
  });

  it('returns false for invalid or relative urls', () => {
    expect(isBookmarkableUrl('example.com')).toBe(false);
    expect(isBookmarkableUrl('/relative/path')).toBe(false);
    expect(isBookmarkableUrl('')).toBe(false);
  });
});
