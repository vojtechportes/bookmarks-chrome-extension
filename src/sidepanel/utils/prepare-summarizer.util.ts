import {
  SUMMARIZE_API_IS_NOT_SUPPORTED,
  SUMMARIZE_API_IS_UNAVILABLE,
} from '../../shared/constants/error-messages';
import { logger } from '../../shared/logger/logger';

export interface IPrepareSummarizerStatus {
  value: number;
  timestamp: Date;
  isDownloading: boolean;
}

export const prepareSummarizer = async (
  options?: SummarizerCreateOptions,
  onProgress?: (status: IPrepareSummarizerStatus) => void,
): Promise<void> => {
  if (!('Summarizer' in window)) {
    logger('error', SUMMARIZE_API_IS_NOT_SUPPORTED, {
      scope: 'sidepanel',
    });

    throw new Error(SUMMARIZE_API_IS_NOT_SUPPORTED);
  }

  const availability = await Summarizer.availability();

  if (availability === 'unavailable') {
    logger('error', SUMMARIZE_API_IS_UNAVILABLE, {
      scope: 'sidepanel',
    });

    throw new Error(SUMMARIZE_API_IS_UNAVILABLE);
  }

  const summarizer = await Summarizer.create({
    ...options,
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', (event) => {
        onProgress?.({
          value: Math.round(event.loaded * 100),
          timestamp: new Date(),
          isDownloading: true,
        });
      });
    },
  });

  summarizer.destroy?.();

  onProgress?.({
    value: 100,
    timestamp: new Date(),
    isDownloading: false,
  });
};
