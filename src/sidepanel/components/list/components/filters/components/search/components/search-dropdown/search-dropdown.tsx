import {
  useCallback,
  useState,
  type ChangeEvent,
  type FC,
  type PropsWithChildren,
} from 'react';
import { DropdownMenu as DropdownMenuBase } from 'radix-ui';
import dropdownMenuClasses from '../../../../../../../dropdown-menu/dropdown-menu.module.css';
import classes from './search-dropdown.module.css';
import { clsx } from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import { IconButton } from '../../../../../../../icon-button/icon-button';
import CloseIcon from '../../../../../../../icons/close-icon.svg?react';
import { useTranslation } from 'react-i18next';

export interface ISearchDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchDropdown: FC<PropsWithChildren<ISearchDropdownProps>> = ({
  value,
  onChange,
  children,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const debouncedOnChange = useDebouncedCallback((nextValue: string) => {
    onChange(nextValue);
  }, 200);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      onChange(nextValue);
      debouncedOnChange(nextValue);
    },
    [debouncedOnChange, onChange],
  );

  const handleReset = useCallback(() => {
    debouncedOnChange.cancel();
    onChange('');
    setOpen(false);
  }, [debouncedOnChange, onChange]);

  return (
    <DropdownMenuBase.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuBase.Trigger asChild>{children}</DropdownMenuBase.Trigger>

      <DropdownMenuBase.Portal>
        <DropdownMenuBase.Content
          className={clsx(dropdownMenuClasses.dropdownMenuContent)}
          sideOffset={5}
        >
          <div className={clsx(classes.inputContainer)}>
            <input
              type="text"
              name="search"
              placeholder={t('type-to-search')}
              value={value}
              onChange={handleChange}
              autoComplete="off"
              className={clsx(classes.input)}
            />

            {value.length > 0 && (
              <IconButton
                size="medium"
                variant="faux"
                className={clsx(classes.clearButton)}
                onClick={handleReset}
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </DropdownMenuBase.Content>
      </DropdownMenuBase.Portal>
    </DropdownMenuBase.Root>
  );
};
