import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Panel } from './panel';
import classes from './panel.module.css';

describe('Panel', () => {
  it('renders children', () => {
    render(
      <Panel>
        <span>Panel content</span>
      </Panel>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('applies default center alignment class', () => {
    render(
      <Panel>
        <span>Panel content</span>
      </Panel>,
    );

    const panel = screen.getByText('Panel content').parentElement;

    expect(panel).toHaveClass(classes.panel);
    expect(panel).toHaveClass(classes.center);
  });

  it('applies optional modifier classes', () => {
    render(
      <Panel fullHeight transparent align="left">
        <span>Panel content</span>
      </Panel>,
    );

    const panel = screen.getByText('Panel content').parentElement;

    expect(panel).toHaveClass(classes.left);
    expect(panel).toHaveClass(classes.fullHeight);
    expect(panel).toHaveClass(classes.transparent);
  });

  it('forwards native div props', () => {
    render(
      <Panel id="panel-id" title="Panel title" data-test="panel">
        <span>Panel content</span>
      </Panel>,
    );

    const panel = screen.getByText('Panel content').parentElement;

    expect(panel).toHaveAttribute('id', 'panel-id');
    expect(panel).toHaveAttribute('title', 'Panel title');
    expect(panel).toHaveAttribute('data-test', 'panel');
  });
});
