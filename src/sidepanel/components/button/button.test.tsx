import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon" />}>Click me</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
