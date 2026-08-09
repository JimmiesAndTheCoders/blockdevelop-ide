import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconSize } from '../Icon/Icon';

export type InputSize = 'xs' | 'sm' | 'md';
export type InputVariant = 'default' | 'code';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize | undefined;
  variant?: InputVariant | undefined;
  leftIcon?: string | ReactNode | undefined;
  rightIcon?: string | ReactNode | undefined;
  clearable?: boolean | undefined;
  onClear?: (() => void) | undefined;
  error?: string | boolean | undefined;
  helperText?: string | undefined;
}

const sizeClassesMap: Record<InputSize, string> = {
  xs: 'h-[22px] px-1.5 text-2xs rounded gap-1',
  sm: 'h-[28px] px-2 text-xs rounded gap-1.5',
  md: 'h-[34px] px-2.5 text-xs rounded-md gap-2',
};

const iconSizeMap: Record<InputSize, IconSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
};

/**
 * Compact dark workspace input component supporting inset borders, clear button, icon slots, and code editing variants.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      error,
      helperText,
      value,
      onChange,
      disabled = false,
      className,
      id,
      ...inputProps
    },
    ref
  ) => {
    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const iconSize = iconSizeMap[size];

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    const renderIconSlot = (icon: string | ReactNode) => {
      if (typeof icon === 'string') {
        return <Icon name={icon} size={iconSize} color="muted" />;
      }
      return icon;
    };

    return (
      <div className="flex flex-col gap-1 w-full font-sans">
        <div
          className={clsx(
            'relative flex items-center w-full transition-colors bg-workspace-dark text-gray-200 border rounded shadow-inner',
            isError
              ? 'border-status-error focus-within:border-status-error focus-within:ring-1 focus-within:ring-status-error'
              : 'border-workspace-border hover:border-workspace-borderLight focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue',
            disabled && 'opacity-50 cursor-not-allowed bg-workspace-panel',
            sizeClassesMap[size]
          )}
        >
          {leftIcon && (
            <span className="inline-flex shrink-0 items-center select-none">{renderIconSlot(leftIcon)}</span>
          )}

          <input
            ref={ref}
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={isError}
            aria-describedby={id && (errorMessage || helperText) ? `${id}-description` : undefined}
            className={clsx(
              'w-full bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 shrink min-w-0',
              variant === 'code' ? 'font-mono text-cyan-300' : 'font-sans',
              className
            )}
            {...inputProps}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear text input"
              className="inline-flex shrink-0 items-center justify-center p-0.5 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="close" size={iconSize} />
            </button>
          )}

          {!clearable && rightIcon && (
            <span className="inline-flex shrink-0 items-center select-none">{renderIconSlot(rightIcon)}</span>
          )}
        </div>

        {(errorMessage || helperText) && (
          <p
            id={id ? `${id}-description` : undefined}
            className={clsx('text-2xs font-medium', isError ? 'text-status-error' : 'text-gray-400')}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
