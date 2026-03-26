export type LogLevel = 'info' | 'warn' | 'error';

export interface ILogMeta {
  scope?: 'sidepanel' | 'service-worker' | 'offscreen' | 'database';
  operation?: string;
  bookmarkId?: string;
  url?: string;
}
