import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

export type SwitchSize = 'xs' | 'sm' | 'md';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'size' | 'onChange'
> {
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  size?: SwitchSize | undefined;
  label?: ReactNode | undefined;
  description?: string | undefined;
}

const switchSizeMap: Record<
  SwitchSize,
  { track: string; knob: string; translate: string; text: string }
> = {
  xs: { track: 'w-7 h-4', knob: 'w-3 h-3', translate: 'translate-x-3', text: 'text-2xs' },
  sm: { track: 'w-8 h-4.5', knob: 'w-3.5 h-3.5', translate: 'translate-x-3.5', text: 'text-xs' },
  md: { track: 'w-10 h-5.5', knob: 'w-4.5 h-4.5', translate: 'translate-x-4.5', text: 'text-xs' },
};

/**
 * Custom dark workspace Switch/Toggle control for IDE preference panes and block options.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      size = 'sm',
      label,
      description,
      disabled = false,
      className,
      id,
      onClick,
      ...buttonProps
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    const sizeConfig = switchSizeMap[size];

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const nextState = !isChecked;
      if (controlledChecked === undefined) {
        setInternalChecked(nextState);
      }
      if (onChange) {
        onChange(nextState);
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <label
        htmlFor={id}
        className={clsx(
          'inline-flex items-center gap-2.5 font-sans select-none cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={clsx(
            'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 border p-0.5',
            'focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 focus-visible:ring-offset-workspace-dark focus-visible:outline-none',
            sizeConfig.track,
            isChecked
              ? 'bg-brand-blue border-brand-blue shadow-inner'
              : 'bg-workspace-header border-workspace-border hover:border-workspace-borderLight',
          )}
          {...buttonProps}
        >
          <span
            className={clsx(
              'pointer-events-none inline-block rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
              sizeConfig.knob,
              isChecked ? sizeConfig.translate : 'translate-x-0',
            )}
          />
        </button>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className={clsx('font-medium text-gray-200', sizeConfig.text)}>{label}</span>
            )}
            {description && <span className="text-2xs text-gray-400">{description}</span>}
          </div>
        )}
      </label>
    );
  },
);

Switch.displayName = 'Switch';

// Alias Toggle component export
export const Toggle = Switch;
