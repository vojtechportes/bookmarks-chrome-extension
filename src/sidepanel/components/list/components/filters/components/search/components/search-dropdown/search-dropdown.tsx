import {
  useCallback,
  useState,
  type ChangeEvent,
  type FC,
  type PropsWithChildren,
} from 'react';
import { DropdownMenu as DropdownMenuBase } from 'radix-ui';
import dropdownMenuClasses from '../../../../../../../dropdown-menu/dropdown-menu.module.css';
import { clsx } from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../../../../input/input';

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
          <Input
            name="search"
            placeholder={t('type-to-search')}
            value={value}
            onChange={handleChange}
            onClear={handleReset}
            clearable
            /**
             * Intentionally disabled no-autofocus rule since
             * in this case, the input is in dropdown menu and
             * which is a form of dialog and should be therefore
             * focused automatically.
             *
             * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
             */
            /* eslint-disable-next-line jsx-a11y/no-autofocus */
            autoFocus
          />
        </DropdownMenuBase.Content>
      </DropdownMenuBase.Portal>
    </DropdownMenuBase.Root>
  );
};
