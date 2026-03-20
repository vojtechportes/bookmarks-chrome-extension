import {
  type CSSProperties,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  Children,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clsx } from 'clsx';
import classes from './masonry.module.css';
import { normalizeSize } from '../../utils/normalize-size.util';
import { type BreakpointKey, type IMasonryProps } from './types';
import { getColumnCount } from './utils/get-columns.util';
import { getBreakpoint } from './utils/get-breakpoint.util';

export const Masonry: FC<PropsWithChildren<IMasonryProps>> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 8,
  className,
  columnClassName,
  itemClassName,
}) => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey | undefined>();
  const [columnCount, setColumnCount] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return typeof columns === 'number' ? columns : (columns.xs ?? 1);
    }

    return getColumnCount(columns, window.innerWidth);
  });

  useEffect(() => {
    const updateColumnCount = (): void => {
      setColumnCount(getColumnCount(columns, window.innerWidth));
      setBreakpoint(getBreakpoint(columns, window.innerWidth));
    };

    updateColumnCount();

    window.addEventListener('resize', updateColumnCount);

    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, [columns]);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  const distributedChildren = useMemo(() => {
    const nextColumns = Array.from(
      { length: columnCount },
      () => [] as ReactNode[],
    );

    childArray.forEach((child, index) => {
      nextColumns[index % columnCount]?.push(child);
    });

    return nextColumns;
  }, [childArray, columnCount]);

  const resolvedGap = normalizeSize(gap);

  const style = {
    '--masonry-gap': resolvedGap,
  } as CSSProperties;

  return (
    <div
      className={clsx(
        classes.root,
        breakpoint && classes[breakpoint],
        className,
      )}
      style={style}
    >
      {distributedChildren.map((columnItems, columnIndex) => (
        <div
          key={columnIndex}
          className={clsx(classes.column, columnClassName)}
        >
          {columnItems.map((child, itemIndex) => (
            <div key={itemIndex} className={clsx(classes.item, itemClassName)}>
              {child}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
