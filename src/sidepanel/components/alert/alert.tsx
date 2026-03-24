import { clsx } from 'clsx';
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import classes from './alert.module.css';
import type { IDataTest } from '../../types/data-test';
import { IconButton } from '../icon-button/icon-button';
import { Typography } from '../typography/typography';
import CloseIcon from '../icons/close-icon.svg?react';
import { ANIMATION_DURATION_MS } from './constants';

export interface IAlertProps extends IDataTest {
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  onDismissed?: () => void;
  autoDismiss?: boolean;
  dismissAfterMs?: number;
  loading?: boolean;
  className?: string;
}

export const Alert: FC<PropsWithChildren<IAlertProps>> = ({
  variant = 'success',
  onClose,
  onDismissed,
  autoDismiss = false,
  dismissAfterMs = 5000,
  loading,
  className,
  children,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissible, setIsDismissible] = useState(false);
  const [isProgressActive, setIsProgressActive] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!autoDismiss || loading || !isVisible) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      setIsProgressActive(true);
    });

    const timeoutId = window.setTimeout(() => {
      setIsDismissible(true);
    }, dismissAfterMs);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [autoDismiss, dismissAfterMs, isVisible, loading]);

  useEffect(() => {
    if (!autoDismiss || loading || !isVisible || !isDismissible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
      onDismissed?.();
    }, ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoDismiss, isVisible, isDismissible, loading, onDismissed]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={clsx(
        classes.root,
        classes[variant],
        autoDismiss && classes.autoDismiss,
        isDismissible && classes.dismissible,
        className,
      )}
    >
      <div
        className={clsx(
          classes.content,
          classes[variant],
          onClose && classes.canClose,
        )}
        {...rest}
        data-test-name="alert"
      >
        <Typography component="p" noMargin loading={loading}>
          {children}
        </Typography>

        {onClose && !loading && (
          <div className={classes.closeButton}>
            <IconButton variant="faux" size="medium" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>

      {autoDismiss && !loading && (
        <div
          className={clsx(
            classes.progressBar,
            isProgressActive && classes.active,
          )}
          style={{ transitionDuration: `${dismissAfterMs}ms` }}
        />
      )}
    </div>
  );
};
