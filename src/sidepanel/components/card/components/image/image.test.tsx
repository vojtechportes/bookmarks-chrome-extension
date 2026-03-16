import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Image } from './image';
import { useDarkMode } from '../../../../hooks/use-dark-mode';

vi.mock('../../../../hooks/use-dark-mode');

describe('Image', () => {
  it('renders image when not loading', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    render(<Image src="test.jpg" alt="test image" />);

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'test image');
  });

  it('renders skeleton when loading', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    const { container } = render(<Image src="test.jpg" loading />);

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('returns null for list view type', () => {
    vi.mocked(useDarkMode).mockReturnValue(false);

    const { container } = render(<Image src="test.jpg" viewType="list" />);

    expect(container.firstChild).toBeNull();
  });
});
