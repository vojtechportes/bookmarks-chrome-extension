import {
  EXTRACTED_TEXT_MAXIMUM_LENGTH,
  EXTRACTED_TITLE_MAXIMUM_LENGTH,
} from '../constants';

export const extractPageText = () => {
  const title =
    document.title?.trim()?.substring(0, EXTRACTED_TITLE_MAXIMUM_LENGTH) ?? '';

  const root =
    document.querySelector('article') ??
    document.querySelector('main') ??
    document.body;

  const text =
    root?.innerText?.trim()?.substring(0, EXTRACTED_TEXT_MAXIMUM_LENGTH) ?? '';

  return [title, text].filter(Boolean).join('\n\n');
};
