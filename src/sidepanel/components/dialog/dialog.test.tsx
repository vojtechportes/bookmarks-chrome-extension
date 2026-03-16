import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './dialog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Dialog', () => {
  it('does not render when closed', () => {
    const { container } = render(<Dialog title="Test title" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders title and description when open', () => {
    render(<Dialog open title="Test title" description="Test description" />);

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <Dialog open title="Test" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    await user.click(screen.getByText('confirm'));
    await user.click(screen.getByText('cancel'));

    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });
});
