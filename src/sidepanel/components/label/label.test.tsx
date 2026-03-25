import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Label</Label>);

    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});
