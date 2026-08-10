import type { FC } from 'react';
import { clsx } from 'clsx';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'accent' | 'haxe' | 'muted' | 'success' | 'error' | 'white';

export interface SpinnerProps {
  size?: SpinnerSize | undefined;
  variant?: SpinnerVariant | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

const sizePixelsMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
};

const variantClassesMap: Record<SpinnerVariant, string> = {
  accent: 'text-brand-blue',
  haxe: 'text-brand-haxeOrange',
  muted: 'text-gray-500',
  success: 'text-status-success',
  error: 'text-status-error',
  white: 'text-white',
};

/**
 * Circular spinner loading component for async builds, compiler tasks, and IDE dialogs.
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  variant = 'accent',
  label = 'Loading...',
  className,
}) => {
  const pixelSize = sizePixelsMap[size];

  return (
    <svg
      role="progressbar"
      aria-busy="true"
      aria-label={label}
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('animate-spin shrink-0', variantClassesMap[variant], className)}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
};
