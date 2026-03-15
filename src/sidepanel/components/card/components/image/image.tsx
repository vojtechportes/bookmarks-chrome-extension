import { AspectRatio } from 'radix-ui';
import type { FC } from 'react';
import classes from './image.module.css';
import { clsx } from 'clsx';
import type { ViewType } from '../../../../scenes/list-scene/types';

export interface IImageProps {
  src: string;
  alt?: string;
  className?: string;
  viewType?: ViewType;
}

export const Image: FC<IImageProps> = ({ src, alt, className, viewType }) => {
  if (viewType === 'list') {
    return null;
  }

  return (
    <AspectRatio.Root ratio={16 / 9} className={clsx(className)}>
      <img src={src} alt={alt} className={classes.img} />
    </AspectRatio.Root>
  );
};
