import { forwardRef, type KeyboardEvent } from 'react';
import { TextInput, type TextInputProps } from './TextInput';

export interface SearchInputProps extends Omit<TextInputProps, 'leftIcon'> {
  onSearch?: ((value: string) => void) | undefined;
}

/**
 * IDE Search bar preset with search lens icon, quick clear button, and ESC key listener.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search...', onClear, onKeyDown, value, onChange, ...props }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && onClear) {
        onClear();
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <TextInput
        ref={ref}
        leftIcon="search"
        clearable
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClear={onClear}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

SearchInput.displayName = 'SearchInput';
