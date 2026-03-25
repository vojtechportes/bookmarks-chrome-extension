import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CopyButton } from './copy-button';
import { AlertProvider } from '../alert-provider/alert-provider';
import type { PropsWithChildren } from 'react';

const textToCopy = 'Text to copy';

const AlertWrapper = ({ children }: PropsWithChildren) => (
  <AlertProvider>{children}</AlertProvider>
);

describe('CopyButton', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children', () => {
    render(<CopyButton value={textToCopy} />, { wrapper: AlertWrapper });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('copies text to clipboard', () => {
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue();

    render(<CopyButton value={textToCopy} />, { wrapper: AlertWrapper });

    fireEvent.click(screen.getByRole('button'));

    expect(writeTextSpy).toHaveBeenCalledWith(textToCopy);
    expect(writeTextSpy).toHaveBeenCalledTimes(1);
  });

  it('throws when outside of context', () => {
    expect(() => render(<CopyButton value={textToCopy} />)).toThrow(Error);
  });
});
