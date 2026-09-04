import { forwardRef, useState, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export type CheckboxSize = 'xs' | 'sm' | 'md';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  size?: CheckboxSize | undefined;
  label?: ReactNode | undefined;
  description?: string | undefined;
  error?: string | boolean | undefined;
}

const sizeClassesMap: Record<CheckboxSize, { box: string; icon: 'xs' | 'sm'; text: string }> = {
  xs: { box: 'w-3.5 h-3.5 rounded', icon: 'xs', text: 'text-2xs' },
  sm: { box: 'w-4 h-4 rounded', icon: 'xs', text: 'text-xs' },
  md: { box: 'w-5 h-5 rounded-md', icon: 'sm', text: 'text-xs' },
};

/**
 * Custom dark workspace Checkbox component with accessible check state and focus ring.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'sm',
      label,
      description,
      error = false,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      className,
      id,
      ...inputProps
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const autoId = useId();
    const inputId = id || autoId;

    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    const isError = Boolean(error);
    const sizeConfig = sizeClassesMap[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (controlledChecked === undefined) {
        setInternalChecked(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const checkedProps =
      controlledChecked !== undefined ? { checked: controlledChecked } : { defaultChecked };

    return (
      <div
        className={clsx(
          'inline-flex items-start gap-2.5 font-sans select-none cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...checkedProps}
            {...inputProps}
          />

          <label
            htmlFor={inputId}
            className={clsx(
              'flex items-center justify-center transition-all duration-150 border cursor-pointer',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-blue peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-workspace-dark',
              sizeConfig.box,
              isChecked
                ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                : isError
                  ? 'bg-workspace-dark border-status-error'
                  : 'bg-workspace-dark border-workspace-border hover:border-workspace-borderLight',
            )}
          >
            {isChecked && <Icon name="check" size={sizeConfig.icon} color="primary" />}
          </label>
        </div>

        {(label || description) && (
          <label htmlFor={inputId} className="flex flex-col cursor-pointer">
            {label && (
              <span className={clsx('font-medium text-gray-200', sizeConfig.text)}>{label}</span>
            )}
            {description && <span className="text-2xs text-gray-400">{description}</span>}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
