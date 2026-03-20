import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { Alert } from '../alert/alert';
import type { IAlertContextValue, IAlertItem, IPushAlertInput } from './types';
import { v4 as uuid } from 'uuid';
import classes from './alert-provider.module.css';
import { clsx } from 'clsx';
import { AlertContext } from './components/alert-context';

export const AlertProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alerts, setAlerts] = useState<IAlertItem[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const pushAlert = useCallback((alert: IPushAlertInput) => {
    const id = uuid();

    const nextAlert: IAlertItem = {
      id,
      autoDismiss: true,
      dismissAfterMs: 5000,
      ...alert,
    };

    setAlerts((current) => [...current, nextAlert]);

    return id;
  }, []);

  const success = useCallback<IAlertContextValue['success']>(
    (content, options) =>
      pushAlert({
        ...options,
        variant: 'success',
        content,
      }),
    [pushAlert],
  );

  const error = useCallback<IAlertContextValue['error']>(
    (content, options) =>
      pushAlert({
        ...options,
        variant: 'error',
        content,
      }),
    [pushAlert],
  );

  const warning = useCallback<IAlertContextValue['error']>(
    (content, options) =>
      pushAlert({
        ...options,
        variant: 'warning',
        content,
      }),
    [pushAlert],
  );

  const info = useCallback<IAlertContextValue['error']>(
    (content, options) =>
      pushAlert({
        ...options,
        variant: 'info',
        content,
      }),
    [pushAlert],
  );

  const value = useMemo<IAlertContextValue>(
    () => ({
      alerts,
      pushAlert,
      removeAlert,
      clearAlerts,
      success,
      error,
      warning,
      info,
    }),
    [
      alerts,
      pushAlert,
      removeAlert,
      clearAlerts,
      success,
      error,
      warning,
      info,
    ],
  );

  return (
    <AlertContext.Provider value={value}>
      {alerts.length > 0 && (
        <div className={clsx(classes.root)}>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.variant}
              autoDismiss={alert.autoDismiss}
              dismissAfterMs={alert.dismissAfterMs}
              loading={alert.loading}
              className={clsx(alert.className)}
              onDismissed={() => {
                removeAlert(alert.id);
              }}
              onClose={() => removeAlert(alert.id)}
            >
              {alert.content}
            </Alert>
          ))}
        </div>
      )}

      {children}
    </AlertContext.Provider>
  );
};
