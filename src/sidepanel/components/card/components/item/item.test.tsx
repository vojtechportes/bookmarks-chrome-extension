import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Item } from './item';
import { useDarkMode } from '../../../../hooks/use-dark-mode';

vi.mock('../../../../hooks/use-dark-mode', () => ({
  useDarkMode: vi.fn(),
}));

describe('Item', () => {
  it('renders children', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    render(<Item>Item content</Item>);

    expect(screen.getByText('Item content')).toBeInTheDocument();
  });

  it('renders start and end adornments', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    render(
      <Item startAdornment={<span>start</span>} endAdornment={<span>end</span>}>
        Item content
      </Item>,
    );

    expect(screen.getByText('start')).toBeInTheDocument();
    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(screen.getByText('end')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    const { container } = render(<Item className="custom-class">Content</Item>);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders loading state', () => {
    vi.mocked(useDarkMode).mockReturnValue(true);

    render(<Item loading>Loading content</Item>);

    expect(screen.queryByText('Loading content')).not.toBeInTheDocument();
  });
});
