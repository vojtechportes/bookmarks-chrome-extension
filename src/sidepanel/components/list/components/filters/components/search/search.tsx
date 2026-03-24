import type { FC } from 'react';
import { IconButton } from '../../../../../icon-button/icon-button';
import SearchIcon from '../../../../../icons/search-icon.svg?react';
import { SearchDropdown } from './components/search-dropdown/search-dropdown';

export interface ISearchProps {
  value: string;
  onChange: (value: string) => void;
  numberMatches?: number;
  loading?: boolean;
}

export const Search: FC<ISearchProps> = ({ value, onChange, loading }) => (
  <div data-test-name="search">
    <SearchDropdown value={value} onChange={onChange}>
      <IconButton
        size="medium"
        loading={loading}
        datat-test-value="dropdown-trigger"
      >
        <SearchIcon />
      </IconButton>
    </SearchDropdown>
  </div>
);
