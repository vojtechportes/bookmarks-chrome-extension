import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('renders children when not loading', () => {
    render(<IconButton>Click me</IconButton>);

    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('renders skeleton instead of children when loading', () => {
    render(<IconButton loading>Click me</IconButton>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<IconButton disabled>Click me</IconButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
