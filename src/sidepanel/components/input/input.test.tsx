import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input';
import type { IIconButtonProps } from '../icon-button/icon-button';

vi.mock('./input.module.css', () => ({
  default: {
    inputContainer: 'inputContainer',
    input: 'input',
    clearButton: 'clearButton',
  },
}));

vi.mock('../icon-button/icon-button', () => ({
  IconButton: ({ children, onClick }: IIconButtonProps) => (
    <button data-testid="clear-btn" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('../icons/close-icon.svg?react', () => ({
  default: () => <svg data-testid="close-icon" />,
}));

describe('Input', () => {
  it('renders input element', () => {
    render(<Input value="test" onChange={() => {}} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does NOT render clear button when not clearable', () => {
    render(<Input value="test" onChange={() => {}} />);

    expect(screen.queryByTestId('clear-btn')).not.toBeInTheDocument();
  });

  it('renders clear button when clearable and has value', () => {
    render(<Input value="test" clearable onChange={() => {}} />);

    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
  });

  it('does NOT render clear button when value is empty', () => {
    render(<Input value="" clearable onChange={() => {}} />);

    expect(screen.queryByTestId('clear-btn')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();

    render(
      <Input value="test" clearable onClear={onClear} onChange={() => {}} />,
    );

    fireEvent.click(screen.getByTestId('clear-btn'));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls slot iconButton onClick before onClear', () => {
    const onClear = vi.fn();
    const slotClick = vi.fn();

    render(
      <Input
        value="test"
        clearable
        onClear={onClear}
        slots={{
          iconButton: {
            onClick: slotClick,
          },
        }}
        onChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId('clear-btn'));

    expect(slotClick).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
