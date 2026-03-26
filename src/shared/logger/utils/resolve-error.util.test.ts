import { describe, it, expect } from 'vitest';
import { resolveError } from './resolve-error.util';

describe('resolveError', () => {
  it('returns message when error is an instance of Error', () => {
    const error = new Error('Something went wrong');

    const result = resolveError(error);

    expect(result).toBe('Something went wrong');
  });

  it('returns undefined when error is undefined', () => {
    const result = resolveError(undefined);

    expect(result).toBeUndefined();
  });

  it('stringifies non-Error values', () => {
    expect(resolveError('failure')).toBe('failure');
  });

  it('stringifies objects', () => {
    const result = resolveError({ foo: 'bar' });

    expect(result).toBe('[object Object]');
  });
});
