import { useContext } from 'react';
import type { IAlertContextValue } from '../types';
import { AlertContext } from '../components/alert-context';

export const useAlert = (): IAlertContextValue => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }

  return context;
};
