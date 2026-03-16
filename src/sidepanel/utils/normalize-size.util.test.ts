import { describe, it, expect } from 'vitest';
import { normalizeSize } from './normalize-size.util';

describe('normalizeSize', () => {
  it('returns undefined for null', () => {
    expect(normalizeSize(null)).toBeUndefined();
  });

  it('converts number to px', () => {
    expect(normalizeSize(10)).toBe('10px');
    expect(normalizeSize(0)).toBe('0px');
    expect(normalizeSize(24)).toBe('24px');
  });

  it('returns string value unchanged', () => {
    expect(normalizeSize('100%')).toBe('100%');
    expect(normalizeSize('2rem')).toBe('2rem');
    expect(normalizeSize('auto')).toBe('auto');
  });
});
