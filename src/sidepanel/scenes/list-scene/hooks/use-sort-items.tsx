import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NewestToOldestIcon from '../../../components/icons/newest-to-oldest-icon.svg?react';
import OldestToNewestIcon from '../../../components/icons/oldest-to-newest-icon.svg?react';
import TitleAscIcon from '../../../components/icons/title-asc-icon.svg?react';
import TitleDescIcon from '../../../components/icons/title-desc-icon.svg?react';
import type { IDropdownMenuItem } from '../../../components/dropdown-menu/dropdown-menu';

export const useSortItems = () => {
  const { t } = useTranslation();

  const sortItems = useMemo<IDropdownMenuItem[]>(
    () => [
      {
        value: 'addedAt-desc',
        label: t('newest-to-oldest'),
        icon: <NewestToOldestIcon />,
      },
      {
        value: 'addedAt-asc',
        label: t('oldest-to-newest'),
        icon: <OldestToNewestIcon />,
      },
      {
        value: 'title-asc',
        label: t('title-asc'),
        icon: <TitleAscIcon />,
      },
      {
        value: 'title-desc',
        label: t('title-desc'),
        icon: <TitleDescIcon />,
      },
    ],
    [t],
  );

  return { sortItems };
};
