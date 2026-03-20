import { signal } from '@preact/signals-react';

export interface ISummarizerSignal {
  value: number;
  timestamp: Date;
  isDownloading: boolean;
}

export const summarizerStatus = signal<ISummarizerSignal | null>(null);
