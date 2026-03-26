import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
    consoleWarnSpy.mockReset();
    consoleLogSpy.mockReset();
  });

  it('logs error using console.error', () => {
    logger('error', 'Error message');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    const [, payload] = consoleErrorSpy.mock.calls[0];

    expect(payload.level).toBe('error');
    expect(payload.message).toBe('Error message');
  });

  it('logs warning using console.warn', () => {
    logger('warn', 'Warning message');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    const [, payload] = consoleWarnSpy.mock.calls[0];

    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('Warning message');
  });

  it('logs info using console.log', () => {
    logger('info', 'Info message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

    const [, payload] = consoleLogSpy.mock.calls[0];

    expect(payload.level).toBe('info');
    expect(payload.message).toBe('Info message');
  });
});
