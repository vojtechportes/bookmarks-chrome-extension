import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { DropdownMenu, type IDropdownMenuItem } from './dropdown-menu';

beforeAll(() => {
  class MockPointerEvent extends MouseEvent {
    button: number;
    ctrlKey: boolean;

    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.button = props.button ?? 0;
      this.ctrlKey = props.ctrlKey ?? false;
    }
  }

  // jsdom often needs these for Radix/Floating UI
  vi.stubGlobal('PointerEvent', MockPointerEvent);

  vi.stubGlobal('DOMRect', {
    fromRect: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: () => {},
    }),
  });
});

const mockItems: IDropdownMenuItem[] = [
  { value: 'one', label: 'One', icon: 'Icon' },
  { value: 'two', label: 'Two' },
];

describe('DropdownMenu', () => {
  it('opens dropdown menu and trigger change event', async () => {
    const mockOnChange = vi.fn();

    render(
      <DropdownMenu
        items={mockItems}
        value={mockItems[0].value}
        onChange={mockOnChange}
        trigger={<button>Trigger</button>}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    fireEvent.pointerDown(trigger, {
      button: 0,
      ctrlKey: false,
    });

    expect(await screen.findByText('One')).toBeInTheDocument();
    expect(
      document.querySelector('[data-test-name="dropdown-menu"]'),
    ).toBeInTheDocument();

    fireEvent.click(await screen.findByText('One'));

    expect(mockOnChange).toHaveBeenCalled();
  });
});
