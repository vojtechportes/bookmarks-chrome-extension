import type { ReactNode } from 'react';
import type { IAlertProps } from '../../alert/alert';

export interface IAlertItem extends Omit<
  IAlertProps,
  'children' | 'onDismissed' | 'onClose'
> {
  id: string;
  content: ReactNode;
}

export interface IPushAlertInput extends Omit<IAlertItem, 'id' | 'content'> {
  content: ReactNode;
}

export interface IAlertContextValue {
  alerts: IAlertItem[];
  pushAlert: (alert: IPushAlertInput) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  success: (
    content: ReactNode,
    options?: Omit<IPushAlertInput, 'content' | 'variant'>,
  ) => string;
  error: (
    content: ReactNode,
    options?: Omit<IPushAlertInput, 'content' | 'variant'>,
  ) => string;
}
