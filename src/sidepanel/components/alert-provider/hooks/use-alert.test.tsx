import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';
import { useAlert } from './use-alert';
import type { PropsWithChildren } from 'react';
import { AlertProvider } from '../alert-provider';

const AlertWrapper = ({ children }: PropsWithChildren) => (
  <AlertProvider>{children}</AlertProvider>
);

describe('useAlert', () => {
  it('returns context value when within context', () => {
    const { result } = renderHook(() => useAlert(), { wrapper: AlertWrapper });

    expect(result.current.success).toBeTypeOf('function');
    expect(result.current.error).toBeTypeOf('function');
    expect(result.current.warning).toBeTypeOf('function');
    expect(result.current.error).toBeTypeOf('function');
  });

  it('throws when outside context', () => {
    expect(() => renderHook(() => useAlert())).toThrow(Error);
  });
});
