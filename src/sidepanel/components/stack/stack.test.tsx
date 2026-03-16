import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack gap={8}>
        <div>First item</div>
        <div>Second item</div>
      </Stack>,
    );

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });

  it('applies normalized gap style', () => {
    render(
      <Stack gap={8}>
        <div>Content</div>
      </Stack>,
    );

    expect(screen.getByText('Content').parentElement).toHaveStyle({
      gap: '8px',
    });
  });

  it('applies custom className', () => {
    render(
      <Stack gap="1rem" className="custom-stack">
        <div>Content</div>
      </Stack>,
    );

    expect(screen.getByText('Content').parentElement).toHaveClass(
      'custom-stack',
    );
  });
});
