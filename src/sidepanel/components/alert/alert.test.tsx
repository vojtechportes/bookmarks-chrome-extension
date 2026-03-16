import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Alert } from './alert';
import { ANIMATION_DURATION_MS } from './constants';

describe('Alert', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(<Alert>Alert message</Alert>);

    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(<Alert onClose={onClose}>Alert message</Alert>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Alert message')).not.toBeInTheDocument();
  });

  it('auto dismisses and calls onDismissed', () => {
    const onDismissed = vi.fn();

    render(
      <Alert autoDismiss dismissAfterMs={1000} onDismissed={onDismissed}>
        Alert message
      </Alert>,
    );

    expect(screen.getByText('Alert message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(ANIMATION_DURATION_MS);
    });

    expect(onDismissed).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Alert message')).not.toBeInTheDocument();
  });
});
