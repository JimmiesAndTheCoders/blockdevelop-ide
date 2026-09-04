import { forwardRef, type HTMLAttributes, type ReactNode, type MouseEvent } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconSize } from '../Icon/Icon';

export type BadgeVariant =
  'default' | 'brand' | 'info' | 'success' | 'warning' | 'error' | 'haxe' | 'platform' | 'outline';

export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | undefined;
  size?: BadgeSize | undefined;
  icon?: string | ReactNode | undefined;
  dismissible?: boolean | undefined;
  onDismiss?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
  children?: ReactNode | undefined;
}

const variantClassesMap: Record<BadgeVariant, string> = {
  default: 'bg-workspace-tab text-gray-300 border-workspace-border',
  brand: 'bg-brand-blue/20 text-brand-blueHover border-brand-blue/40',
  info: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
  success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  warning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  error: 'bg-red-950/60 text-red-300 border-red-800/60',
  haxe: 'bg-amber-950/80 text-brand-haxeOrange border-brand-haxeOrange/60 font-mono',
  platform: 'bg-workspace-dark text-gray-200 border-workspace-border font-mono',
  outline: 'bg-transparent text-gray-300 border-workspace-border',
};

const sizeClassesMap: Record<BadgeSize, string> = {
  xs: 'h-[18px] px-1.5 text-2xs rounded gap-1',
  sm: 'h-[22px] px-2 text-2xs rounded-md gap-1',
  md: 'h-[26px] px-2.5 text-xs rounded-md gap-1.5',
};

const iconSizeMap: Record<BadgeSize, IconSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
};

/**
 * Compact IDE status badge/tag component supporting color variants, icon slots, and optional dismissal cross button.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      icon,
      dismissible = false,
      onDismiss,
      children,
      className,
      ...spanProps
    },
    ref,
  ) => {
    const iconSize = iconSizeMap[size];
    const isDismissible = dismissible || Boolean(onDismiss);

    const renderIconSlot = (iconItem: string | ReactNode) => {
      if (typeof iconItem === 'string') {
        return <Icon name={iconItem} size={iconSize} color="inherit" />;
      }
      return iconItem;
    };

    return (
      <span
        ref={ref}
        role="status"
        className={clsx(
          'inline-flex items-center justify-center border font-sans select-none shrink-0 transition-colors leading-none',
          variantClassesMap[variant],
          sizeClassesMap[size],
          className,
        )}
        {...spanProps}
      >
        {icon && <span className="inline-flex shrink-0">{renderIconSlot(icon)}</span>}

        {children && <span>{children}</span>}

        {isDismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss badge"
            className="inline-flex shrink-0 items-center justify-center p-0.5 rounded hover:bg-black/30 transition-colors -mr-0.5"
          >
            <Icon name="close" size={iconSize} color="inherit" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

// Export Tag alias
export const Tag = Badge;
export type TagProps = BadgeProps;
