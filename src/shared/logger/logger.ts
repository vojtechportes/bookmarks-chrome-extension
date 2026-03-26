import type { LogLevel } from 'vite';
import type { ILogMeta } from './types';
import { resolveError } from './utils/resolve-error.util';
import { LOG_PREFIX } from './constants';

export const logger = (
  level: LogLevel,
  message: string,
  meta?: ILogMeta,
  error?: unknown,
) => {
  const isDev = import.meta.env.DEV;

  const payload = {
    level,
    message,
    ...meta,
    errorMessage: isDev ? resolveError(error) : undefined,
  };

  if (level === 'error') {
    console.error(LOG_PREFIX, payload);
    return;
  }

  if (level === 'warn') {
    console.warn(LOG_PREFIX, payload);
    return;
  }

  console.log(LOG_PREFIX, payload);
};
