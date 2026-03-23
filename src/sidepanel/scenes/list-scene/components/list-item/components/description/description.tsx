import type { FC } from 'react';
import { Item } from '../../../../../../components/card/components/item/item';
import { clsx } from 'clsx';
import CreationIcon from '../../../../../../components/icons/creation-icon.svg?react';
import type { ViewType } from '../../../../types/view-type';
import { truncate } from '../../../../../../../shared/utils/truncate.util';
import classes from './description.module.css';

export interface IDescriptionProps {
  description: string | null;
  viewType: ViewType;
  loading: boolean;
  isGeneratingDescription?: boolean;
}

export const Description: FC<IDescriptionProps> = ({
  description,
  loading,
  isGeneratingDescription,
  viewType,
}) => (
  <div>
    {viewType === 'tiles' && (
      <Item
        className={clsx(classes.root)}
        loading={loading || isGeneratingDescription}
        slots={{
          skeleton: {
            width: '100%',
            height: '64px',
          },
          typography: {
            className: clsx(classes.typography),
            loadingStartAdornment: isGeneratingDescription ? (
              <span className={clsx(classes.generatingDescription)}>
                <CreationIcon />
              </span>
            ) : null,
          },
        }}
      >
        {description ? truncate(description) : '-'}
      </Item>
    )}
  </div>
);
