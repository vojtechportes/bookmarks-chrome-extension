import { useContext } from 'react';
import type { IBookmarksContext } from '../types';
import { BookmarksContext } from '../components/bookmarks-context';

export const useBookmarksContext = (): IBookmarksContext => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within BookmarksProvider',
    );
  }

  return context;
};
