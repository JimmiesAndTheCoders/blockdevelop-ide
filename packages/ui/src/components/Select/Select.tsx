import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  type FC,
} from 'react';
import { clsx } from 'clsx';
import { Icon, type IconSize } from '../Icon/Icon';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | ReactNode | undefined;
  disabled?: boolean | undefined;
  description?: string | undefined;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export type SelectSize = 'xs' | 'sm' | 'md';

export interface SelectProps {
  options: (SelectOption | SelectGroup)[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  placeholder?: string | undefined;
  size?: SelectSize | undefined;
  searchable?: boolean | undefined;
  searchPlaceholder?: string | undefined;
  disabled?: boolean | undefined;
  error?: string | boolean | undefined;
  helperText?: string | undefined;
  leftIcon?: string | ReactNode | undefined;
  className?: string | undefined;
  id?: string | undefined;
}

const sizeClassesMap: Record<SelectSize, string> = {
  xs: 'h-[22px] px-1.5 text-2xs rounded gap-1',
  sm: 'h-[28px] px-2 text-xs rounded gap-1.5',
  md: 'h-[34px] px-2.5 text-xs rounded-md gap-2',
};

const iconSizeMap: Record<SelectSize, IconSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
};

function isSelectGroup(item: SelectOption | SelectGroup): item is SelectGroup {
  return 'options' in item && Array.isArray((item as SelectGroup).options);
}

/**
 * Custom accessible IDE Dropdown Select component with dark panel styling, search filtering, and option grouping.
 */
export const Select: FC<SelectProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select option...',
  size = 'md',
  searchable = false,
  searchPlaceholder = 'Filter options...',
  disabled = false,
  error = false,
  helperText,
  leftIcon,
  className,
  id,
}) => {
  const [internalValue, setInternalValue] = useState<string>(controlledValue ?? defaultValue ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const iconSize = iconSizeMap[size];

  // Flatten options into flat list for navigation & matching
  const flatOptions = useMemo(() => {
    const list: SelectOption[] = [];
    options.forEach((item) => {
      if (isSelectGroup(item)) {
        item.options.forEach((opt) => list.push(opt));
      } else {
        list.push(item);
      }
    });
    return list;
  }, [options]);

  // Find currently selected option object
  const selectedOption = useMemo(
    () => flatOptions.find((opt) => opt.value === activeValue),
    [flatOptions, activeValue],
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase().trim();
    const result: (SelectOption | SelectGroup)[] = [];

    options.forEach((item) => {
      if (isSelectGroup(item)) {
        const matchedSubOptions = item.options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(query) ||
            opt.value.toLowerCase().includes(query) ||
            (opt.description && opt.description.toLowerCase().includes(query)),
        );
        if (matchedSubOptions.length > 0) {
          result.push({ label: item.label, options: matchedSubOptions });
        }
      } else {
        if (
          item.label.toLowerCase().includes(query) ||
          item.value.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        ) {
          result.push(item);
        }
      }
    });

    return result;
  }, [options, searchQuery]);

  // Flatten filtered list for keyboard selection mapping
  const flatFilteredOptions = useMemo(() => {
    const list: SelectOption[] = [];
    filteredOptions.forEach((item) => {
      if (isSelectGroup(item)) {
        item.options.forEach((opt) => list.push(opt));
      } else {
        list.push(item);
      }
    });
    return list;
  }, [filteredOptions]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    if (onChange) onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) => (prev < flatFilteredOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatFilteredOptions.length - 1));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (isOpen && activeIndex >= 0 && activeIndex < flatFilteredOptions.length) {
        e.preventDefault();
        const selected = flatFilteredOptions[activeIndex];
        if (selected) handleSelect(selected);
      } else if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const renderIconSlot = (icon: string | ReactNode) => {
    if (typeof icon === 'string') {
      return <Icon name={icon} size={iconSize} color="muted" />;
    }
    return icon;
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={clsx('relative flex flex-col gap-1 w-full font-sans select-none', className)}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={isError}
        className={clsx(
          'flex items-center justify-between w-full transition-colors bg-workspace-dark text-gray-200 border rounded shadow-inner text-left',
          isError
            ? 'border-status-error focus:ring-1 focus:ring-status-error'
            : 'border-workspace-border hover:border-workspace-borderLight focus:border-brand-blue focus:ring-1 focus:ring-brand-blue',
          disabled && 'opacity-50 cursor-not-allowed bg-workspace-panel',
          sizeClassesMap[size],
        )}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {leftIcon && <span className="inline-flex shrink-0">{renderIconSlot(leftIcon)}</span>}
          {selectedOption?.icon && (
            <span className="inline-flex shrink-0">{renderIconSlot(selectedOption.icon)}</span>
          )}
          <span
            className={clsx(
              'truncate',
              selectedOption ? 'text-gray-100 font-medium' : 'text-gray-500',
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <Icon
          name="chevron-down"
          size={iconSize}
          color="muted"
          className={clsx('transition-transform duration-150 shrink-0', isOpen && 'rotate-180')}
        />
      </button>

      {/* Floating Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 top-full mt-1 w-full z-50 max-h-60 overflow-y-auto bg-workspace-panel border border-workspace-border rounded-md shadow-ide-dropdown p-1 space-y-0.5 text-xs text-gray-200"
        >
          {searchable && (
            <div className="p-1 mb-1 border-b border-workspace-border">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-workspace-dark text-gray-200 border border-workspace-border focus:border-brand-blue focus:outline-none rounded px-2 py-1 text-2xs font-sans placeholder-gray-500"
              />
            </div>
          )}

          {flatFilteredOptions.length === 0 ? (
            <div className="p-2 text-center text-gray-500 text-2xs">No matching options</div>
          ) : (
            filteredOptions.map((item, idx) => {
              if (isSelectGroup(item)) {
                return (
                  <div key={`group-${idx}`} className="space-y-0.5">
                    <div className="px-2 py-1 text-2xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </div>
                    {item.options.map((opt) => {
                      const isSelected = opt.value === activeValue;
                      return (
                        <div
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt)}
                          className={clsx(
                            'flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors',
                            opt.disabled
                              ? 'opacity-40 cursor-not-allowed'
                              : isSelected
                                ? 'bg-workspace-selection text-white font-medium'
                                : 'hover:bg-workspace-hover text-gray-200',
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {opt.icon && (
                              <span className="inline-flex shrink-0">
                                {renderIconSlot(opt.icon)}
                              </span>
                            )}
                            <div className="flex flex-col truncate">
                              <span className="truncate">{opt.label}</span>
                              {opt.description && (
                                <span className="text-2xs text-gray-400 truncate">
                                  {opt.description}
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && <Icon name="check" size="xs" color="accent" />}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              const isSelected = item.value === activeValue;
              return (
                <div
                  key={item.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  className={clsx(
                    'flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors',
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
                        ? 'bg-workspace-selection text-white font-medium'
                        : 'hover:bg-workspace-hover text-gray-200',
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon && (
                      <span className="inline-flex shrink-0">{renderIconSlot(item.icon)}</span>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.label}</span>
                      {item.description && (
                        <span className="text-2xs text-gray-400 truncate">{item.description}</span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Icon name="check" size="xs" color="accent" />}
                </div>
              );
            })
          )}
        </div>
      )}

      {(errorMessage || helperText) && (
        <p
          className={clsx('text-2xs font-medium', isError ? 'text-status-error' : 'text-gray-400')}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
};
