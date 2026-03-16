import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Title } from './title';
import { useDarkMode } from '../../../../hooks/use-dark-mode';

vi.mock('../../../../hooks/use-dark-mode', () => ({
  useDarkMode: vi.fn(),
}));

describe('Title', () => {
  it('renders children', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    render(<Title>Title content</Title>);

    expect(screen.getByText('Title content')).toBeInTheDocument();
  });

  it('renders start and end adornments', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    render(
      <Title
        startAdornment={<span>start</span>}
        endAdornment={<span>end</span>}
      >
        Title content
      </Title>,
    );

    expect(screen.getByText('start')).toBeInTheDocument();
    expect(screen.getByText('Title content')).toBeInTheDocument();
    expect(screen.getByText('end')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    const { container } = render(
      <Title className="custom-class">Title content</Title>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with viewType class', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    const { container } = render(<Title viewType="tiles">Title content</Title>);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders loading state', () => {
    vi.mocked(useDarkMode).mockReturnValue(true);

    render(<Title loading>Loading title</Title>);

    expect(screen.queryByText('Loading title')).not.toBeInTheDocument();
  });
});
