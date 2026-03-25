import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Error } from './error';

describe('Error', () => {
  it('renders children', () => {
    render(<Error>Error text</Error>);

    expect(screen.getByText('Error text')).toBeInTheDocument();
  });
});
