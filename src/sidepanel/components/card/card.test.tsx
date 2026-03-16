import { Fragment } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card';

const Child = ({
  loading,
  viewType,
}: {
  loading?: boolean;
  viewType?: 'tiles' | 'list';
}) => (
  <div>
    child-{String(loading)}-{viewType}
  </div>
);

describe('Card', () => {
  it('renders children and passes loading and viewType props', () => {
    render(
      <Card loading viewType="list">
        <Child />
      </Card>,
    );

    expect(screen.getByText('child-true-list')).toBeInTheDocument();
  });

  it('throws when child is not a valid React element', () => {
    expect(() => render(<Card>{'text child'}</Card>)).toThrow(
      'Only valid React elements are allowed.',
    );
  });

  it('throws when child is a fragment', () => {
    expect(() =>
      render(
        <Card>
          <Fragment>
            <div>content</div>
          </Fragment>
        </Card>,
      ),
    ).toThrow('Fragments are not supported');
  });
});
