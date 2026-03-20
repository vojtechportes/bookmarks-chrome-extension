import { SUMMARIZER_OPTIONS } from '../../shared/constants/summarizer';

export const getSummarizerAvailability = async (): Promise<
  Availability | false
> => {
  if (!Summarizer) {
    return false;
  }

  const availability = await Summarizer.availability(SUMMARIZER_OPTIONS);

  return availability;
};
