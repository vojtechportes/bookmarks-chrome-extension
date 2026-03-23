import { useCallback } from 'react';
import Highlighter from 'react-highlight-words';
import classes from '../../../../../components/shared.module.css';

export const useRenderHighlightedText = (searchTerms: string[] = []) => {
  const renderHighlightedText = useCallback(
    (value?: string) => {
      const resolvedValue = value ?? '';

      if (!searchTerms.length) {
        return resolvedValue;
      }

      return (
        <Highlighter
          searchWords={searchTerms}
          textToHighlight={resolvedValue}
          autoEscape
          highlightClassName={classes.highlight}
        />
      );
    },
    [searchTerms],
  );

  return { renderHighlightedText };
};
