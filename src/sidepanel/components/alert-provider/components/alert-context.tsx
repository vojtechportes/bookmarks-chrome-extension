import { createContext } from 'react';
import type { IAlertContextValue } from '../types';

export const AlertContext = createContext<IAlertContextValue | null>(null);
