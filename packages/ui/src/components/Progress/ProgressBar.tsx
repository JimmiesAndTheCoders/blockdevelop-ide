import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';

export type ProgressBarVariant = 'accent' | 'haxe' | 'success' | 'warning' | 'error' | 'neutral';

export type ProgressBarSize = 'xs' | 'sm' | 'md';

export interface ProgressBarProps {
  value?: number | undefined;
  max?: number | undefined;
  variant?: ProgressBarVariant | undefined;
  size?: ProgressBarSize | undefined;
  indeterminate?: boolean | undefined;
  showPercentage?: boolean | undefined;
  label?: ReactNode | undefined;
  className?: string | undefined;
}

const variantFillClassesMap: Record<ProgressBarVariant, string> = {
  accent: 'bg-brand-blue',
  haxe: 'bg-brand-haxeOrange',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  neutral: 'bg-gray-400',
};

const sizeClassesMap: Record<ProgressBarSize, string> = {
  xs: 'h-[3px]',
  sm: 'h-[6px] rounded-full',
  md: 'h-[10px] rounded-full',
};

/**
 * IDE Progress Bar component supporting determinate percentages, indeterminate build animation, and status bar sizing.
 */
export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'accent',
  size = 'sm',
  indeterminate = false,
  showPercentage = false,
  label,
  className,
}) => {
  const isIndeterminate = indeterminate || value === undefined;
  const clampedValue = Math.min(Math.max(value ?? 0, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);

  return (
    <div className={clsx('flex flex-col gap-1 w-full font-sans select-none', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-2xs font-medium text-gray-300">
          {label && <span className="truncate">{label}</span>}
          {showPercentage && !isIndeterminate && <span>{percentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        className={clsx(
          'relative w-full bg-workspace-dark border border-workspace-border/40 overflow-hidden shrink-0',
          sizeClassesMap[size],
        )}
      >
        {isIndeterminate ? (
          <div
            data-testid="progress-indeterminate"
            className={clsx(
              'h-full w-full animate-pulse bg-gradient-to-r from-transparent via-brand-blue to-transparent',
              variantFillClassesMap[variant],
            )}
          />
        ) : (
          <div
            data-testid="progress-fill"
            style={{ width: `${percentage}%` }}
            className={clsx(
              'h-full transition-all duration-200 ease-out',
              variantFillClassesMap[variant],
            )}
          />
        )}
      </div>
    </div>
  );
};
