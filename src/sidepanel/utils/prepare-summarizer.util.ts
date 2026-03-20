import {
  SUMMARIZE_API_IS_NOT_SUPPORTED,
  SUMMARIZE_API_IS_UNAVILABLE,
} from '../../shared/constants/error-messages';
import { summarizerStatus } from '../signals/summarizer-status.signal';

export const prepareSummarizer = async (
  options?: SummarizerCreateOptions,
): Promise<void> => {
  if (!('Summarizer' in window)) {
    throw new Error(SUMMARIZE_API_IS_NOT_SUPPORTED);
  }

  const availability = await Summarizer.availability();

  if (availability === 'unavailable') {
    throw new Error(SUMMARIZE_API_IS_UNAVILABLE);
  }

  const summarizer = await Summarizer.create({
    ...options,
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', (event) => {
        summarizerStatus.value = {
          value: Math.round(event.loaded * 100),
          timestamp: new Date(),
          isDownloading: true,
        };
      });
    },
  });

  summarizer.destroy?.();

  summarizerStatus.value = {
    value: 100,
    timestamp: new Date(),
    isDownloading: false,
  };
};
