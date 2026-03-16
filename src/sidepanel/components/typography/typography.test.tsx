import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Typography } from './typography';

describe('Typography', () => {
  it('renders children', () => {
    render(<Typography>Lorem ipsum</Typography>);

    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
  });

  it('renders as the provided component', () => {
    render(<Typography component="span">Inline text</Typography>);

    const element = screen.getByText('Inline text');
    expect(element.tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Typography className="custom-class">Hello</Typography>);

    expect(screen.getByText('Hello')).toHaveClass('custom-class');
  });

  it('applies textAlign style', () => {
    render(<Typography textAlign="center">Centered text</Typography>);

    expect(screen.getByText('Centered text')).toHaveStyle({
      textAlign: 'center',
    });
  });

  it('renders skeleton when loading', () => {
    const { container } = render(<Typography loading>Lorem ipsum</Typography>);

    expect(screen.queryByText('Lorem ipsum')).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes props to the rendered component', () => {
    render(<Typography data-testid="typography">Hello</Typography>);

    expect(screen.getByTestId('typography')).toBeInTheDocument();
  });
});
