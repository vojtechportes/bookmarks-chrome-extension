import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders rectangle with width and height styles', () => {
    const { container } = render(<Skeleton width={120} height={40} />);

    expect(container.firstChild).toHaveStyle({
      width: '120px',
      height: '40px',
    });
  });

  it('renders circle using size for width and height', () => {
    const { container } = render(<Skeleton shape="circle" size={60} />);

    expect(container.firstChild).toHaveStyle({
      width: '60px',
      height: '60px',
    });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports string width and height values', () => {
    const { container } = render(<Skeleton width="75%" height="2rem" />);

    expect(container.firstChild).toHaveStyle({
      width: '75%',
      height: '2rem',
    });
  });

  it('renders without rounded corners', () => {
    const { container } = render(<Skeleton roundedCorners={false} />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
