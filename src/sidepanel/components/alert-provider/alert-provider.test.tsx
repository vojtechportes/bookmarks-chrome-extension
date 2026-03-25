import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useContext, type FC } from 'react';
import { AlertProvider } from './alert-provider';
import { AlertContext } from './components/alert-context';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

vi.mock('../alert/alert', () => ({
  Alert: ({
    children,
    variant,
    autoDismiss,
    dismissAfterMs,
    loading,
    className,
    onClose,
    onDismissed,
  }: {
    children: React.ReactNode;
    variant: string;
    autoDismiss?: boolean;
    dismissAfterMs?: number;
    loading?: boolean;
    className?: string;
    onClose?: () => void;
    onDismissed?: () => void;
  }) => (
    <div
      data-testid="alert"
      data-variant={variant}
      data-autodismiss={String(autoDismiss)}
      data-dismiss-after-ms={String(dismissAfterMs)}
      data-loading={String(loading)}
      data-class-name={className ?? ''}
    >
      <span>{children}</span>

      <button onClick={onClose}>close</button>
      <button onClick={onDismissed}>dismissed</button>
    </div>
  ),
}));

import { v4 as uuid, type Version4Options } from 'uuid';

const mockedUuid = vi.mocked(uuid) as unknown as MockedFunction<{
  (options?: Version4Options, buf?: undefined, offset?: number): string;
}>;

const TestConsumer: FC = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('AlertContext not found');
  }

  return (
    <div>
      <button
        onClick={() =>
          context.pushAlert({
            variant: 'success',
            content: 'Manual alert',
          })
        }
      >
        Push
      </button>

      <button onClick={() => context.success('Success alert')}>Success</button>

      <button onClick={() => context.error('Error alert')}>Error</button>

      <button onClick={() => context.warning('Warning alert')}>Warning</button>

      <button onClick={() => context.info('Info alert')}>Info</button>

      <button onClick={() => context.removeAlert('alert-1')}>
        Remove alert
      </button>

      <div data-testid="alerts-count">{context.alerts.length}</div>
    </div>
  );
};

describe('AlertProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <AlertProvider>
        <div>Content</div>
      </AlertProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('pushes alert with default values', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Push'));

    const alert = screen.getByTestId('alert');

    expect(alert).toHaveTextContent('Manual alert');
    expect(alert).toHaveAttribute('data-variant', 'success');
    expect(alert).toHaveAttribute('data-autodismiss', 'true');
    expect(alert).toHaveAttribute('data-dismiss-after-ms', '5000');
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('1');
  });

  it('creates success alert after click on "success" button', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Success'));

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveTextContent('Success alert');
    expect(alert).toHaveAttribute('data-variant', 'success');
  });

  it('creates error alert after click on "error" button', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Error'));

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveTextContent('Error alert');
    expect(alert).toHaveAttribute('data-variant', 'error');
  });

  it('creates warning alert after click on "warning" button', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Warning'));

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveTextContent('Warning alert');
    expect(alert).toHaveAttribute('data-variant', 'warning');
  });

  it('creates warning alert after click on "info" button', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Info'));

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveTextContent('Info alert');
    expect(alert).toHaveAttribute('data-variant', 'info');
  });

  it('removes alert', () => {
    mockedUuid.mockReturnValue('alert-1');

    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('Push'));
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Remove alert'));

    expect(screen.getByTestId('alerts-count')).toHaveTextContent('0');
  });
});
