import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

export type KbdSize = 'xs' | 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  shortcut?: string | undefined;
  keys?: string[] | undefined;
  size?: KbdSize | undefined;
  children?: ReactNode | undefined;
}

const sizeClassesMap: Record<KbdSize, string> = {
  xs: 'px-1 py-0.5 text-2xs h-4.5 rounded leading-none min-w-[16px]',
  sm: 'px-1.5 py-0.5 text-2xs h-5 rounded-md leading-none min-w-[18px]',
  md: 'px-2 py-1 text-xs h-6 rounded-md leading-none min-w-[22px]',
};

/**
 * Styled <kbd> keyboard shortcut chip for command palettes, tooltips, menus, and shortcut settings.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ shortcut, keys, size = 'xs', children, className, ...kbdProps }, ref) => {
    // Parse shortcut string "Ctrl+Shift+P" into array of keys
    const parsedKeys: string[] = keys
      ? keys
      : shortcut
        ? shortcut.split('+').map((k) => k.trim())
        : [];

    if (parsedKeys.length > 0) {
      return (
        <span className="inline-flex items-center gap-1 font-mono shrink-0">
          {parsedKeys.map((keyItem, idx) => (
            <kbd
              key={`${keyItem}-${idx}`}
              className={clsx(
                'inline-flex items-center justify-center font-mono font-medium text-gray-300 bg-workspace-dark border border-workspace-border shadow-sm select-none shrink-0',
                sizeClassesMap[size],
                className,
              )}
            >
              {keyItem}
            </kbd>
          ))}
        </span>
      );
    }

    return (
      <kbd
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-mono font-medium text-gray-300 bg-workspace-dark border border-workspace-border shadow-sm select-none shrink-0',
          sizeClassesMap[size],
          className,
        )}
        {...kbdProps}
      >
        {children}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
