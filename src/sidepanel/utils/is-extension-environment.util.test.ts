import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isExtensionEnvironment } from './is-extension-environment.util';

describe('isExtensionEnvironment', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when chrome is undefined', () => {
    vi.stubGlobal('chrome', undefined);

    expect(isExtensionEnvironment()).toBe(false);
  });

  it('returns false when chrome.runtime is missing', () => {
    vi.stubGlobal('chrome', {});

    expect(isExtensionEnvironment()).toBe(false);
  });

  it('returns false when sendMessage is not a function', () => {
    vi.stubGlobal('chrome', {
      runtime: {},
    });

    expect(isExtensionEnvironment()).toBe(false);
  });

  it('returns true in extension environment', () => {
    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage: vi.fn(),
      },
    });

    expect(isExtensionEnvironment()).toBe(true);
  });
});
