import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconSize } from '../Icon/Icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'accent';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  isLoading?: boolean | undefined;
  leftIcon?: string | ReactNode | undefined;
  rightIcon?: string | ReactNode | undefined;
  fullWidth?: boolean | undefined;
  children?: ReactNode | undefined;
}

const variantClassesMap: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-blue hover:bg-brand-blueHover text-white shadow-sm border border-transparent active:bg-blue-700',
  secondary:
    'bg-workspace-tab hover:bg-workspace-hover text-gray-200 border border-workspace-border active:bg-workspace-active',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-sm border border-transparent active:bg-red-700',
  ghost:
    'bg-transparent hover:bg-workspace-hover text-gray-300 hover:text-white active:bg-workspace-active border border-transparent',
  outline:
    'bg-transparent hover:bg-workspace-hover text-gray-200 border border-workspace-border active:bg-workspace-active',
  accent:
    'bg-brand-haxeOrange hover:bg-brand-haxeHover text-white shadow-sm border border-transparent active:bg-amber-600',
};

const sizeClassesMap: Record<ButtonSize, string> = {
  xs: 'h-[22px] px-1.5 text-2xs font-medium rounded gap-1',
  sm: 'h-[28px] px-2.5 text-xs font-medium rounded gap-1.5',
  md: 'h-[34px] px-3.5 text-xs font-semibold rounded gap-2',
  lg: 'h-[40px] px-4 text-sm font-semibold rounded-md gap-2.5',
};

const sizeIconMap: Record<ButtonSize, IconSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

/**
 * High-density IDE Button component supporting variants, sizes, icon slots, and loading states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      children,
      className,
      type = 'button',
      ...buttonProps
    },
    ref
  ) => {
    const iconSize = sizeIconMap[size];
    const isDisabled = disabled || isLoading;

    const renderIconSlot = (icon: string | ReactNode) => {
      if (typeof icon === 'string') {
        return <Icon name={icon} size={iconSize} />;
      }
      return icon;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center select-none font-sans transition-all duration-150',
          'focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 focus-visible:ring-offset-workspace-dark focus-visible:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClassesMap[variant],
          sizeClassesMap[size],
          fullWidth && 'w-full',
          className
        )}
        {...buttonProps}
      >
        {isLoading ? (
          <Icon name="refresh" spin size={iconSize} className="shrink-0" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0 items-center">{renderIconSlot(leftIcon)}</span>
        )}

        {children && <span>{children}</span>}

        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center">{renderIconSlot(rightIcon)}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
