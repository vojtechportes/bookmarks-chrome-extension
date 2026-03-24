import { AspectRatio } from 'radix-ui';
import type { FC } from 'react';
import classes from './image.module.css';
import { clsx } from 'clsx';
import type { ViewType } from '../../../../scenes/list-scene/types/view-type';
import { useDarkMode } from '../../../../hooks/use-dark-mode';
import { Skeleton } from '../../../skeleton/skeleton';

export interface IImageProps {
  src: string;
  alt?: string;
  className?: string;
  viewType?: ViewType;
  loading?: boolean;
}

export const Image: FC<IImageProps> = ({
  src,
  alt,
  className,
  viewType,
  loading,
}) => {
  const isDark = useDarkMode();

  if (viewType === 'list') {
    return null;
  }

  return (
    <AspectRatio.Root
      ratio={16 / 9}
      className={clsx(className)}
      data-test-name="image"
    >
      {loading ? (
        <Skeleton
          height="100%"
          variant={isDark ? 'light' : 'dark'}
          roundedCorners={false}
        />
      ) : (
        <img src={src} alt={alt} className={classes.img} />
      )}
    </AspectRatio.Root>
  );
};
