import { createContext } from 'react';
import type { IBookmarksContext } from '../types';

export const BookmarksContext = createContext<IBookmarksContext | undefined>(
  undefined,
);
