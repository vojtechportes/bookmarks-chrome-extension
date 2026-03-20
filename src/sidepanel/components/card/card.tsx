import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type FC,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './card.module.css';
import type { ListVariantType } from '../list/components/filters/components/view-type/view-type';

export interface ICardProps
  extends React.HTMLAttributes<HTMLDivElement>, IDataTest {
  loading?: boolean;
  highlighted?: boolean;
  viewType?: ListVariantType;
  clickable?: boolean;
}

export const Card: FC<PropsWithChildren<ICardProps>> = ({
  loading,
  children,
  highlighted,
  viewType,
  clickable,
  className,
  ...rest
}) => {
  const clonedElements = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      throw new Error('Only valid React elements are allowed.');
    }

    if (child.type === Fragment) {
      throw new Error('Fragments are not supported');
    }

    return cloneElement(
      child as ReactElement<{ loading?: boolean; viewType?: ListVariantType }>,
      {
        loading,
        viewType,
      },
    );
  });

  return (
    <div
      className={clsx(
        classes.root,
        highlighted && classes.highlighted,
        clickable && classes.clickable,
        loading && classes.loading,
        className,
      )}
      {...rest}
    >
      {clonedElements}
    </div>
  );
};
