import type { FC, SVGProps } from 'react';
import { clsx } from 'clsx';
import {
  Play,
  Pause,
  Square,
  RotateCw,
  Folder,
  FolderOpen,
  File,
  FileCode,
  Code,
  Terminal,
  Settings,
  Search,
  X,
  Check,
  AlertTriangle,
  Bug,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Trash2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Box,
  Cpu,
  Layers,
  Globe,
  LucideProps,
} from 'lucide-react';
import { customIconMap } from './customIcons';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export type IconColor =
  | 'primary'
  | 'secondary'
  | 'brand'
  | 'haxe'
  | 'accent'
  | 'error'
  | 'warning'
  | 'success'
  | 'muted'
  | 'inherit';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color' | 'size'> {
  name: string;
  size?: IconSize | undefined;
  color?: IconColor | undefined;
  spin?: boolean | undefined;
  className?: string | undefined;
  title?: string | undefined;
}

const lucideIconMap: Record<string, FC<LucideProps>> = {
  play: Play,
  pause: Pause,
  stop: Square,
  refresh: RotateCw,
  folder: Folder,
  'folder-open': FolderOpen,
  file: File,
  'file-code': FileCode,
  code: Code,
  terminal: Terminal,
  settings: Settings,
  search: Search,
  close: X,
  check: Check,
  alert: AlertTriangle,
  bug: Bug,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  copy: Copy,
  trash: Trash2,
  plus: Plus,
  minus: Minus,
  eye: Eye,
  'eye-off': EyeOff,
  box: Box,
  cpu: Cpu,
  layers: Layers,
  globe: Globe,
};

const sizePixelsMap: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const colorClassesMap: Record<IconColor, string> = {
  primary: 'text-gray-200 dark:text-gray-200',
  secondary: 'text-gray-400 dark:text-gray-400',
  brand: 'text-brand-blue',
  haxe: 'text-brand-haxeOrange',
  accent: 'text-brand-blue',
  error: 'text-status-error',
  warning: 'text-status-warning',
  success: 'text-status-success',
  muted: 'text-gray-500',
  inherit: 'text-current',
};

/**
 * Unified Icon component wrapping Lucide icons & custom FlashDevelop/HaxeDevelop SVGs.
 */
export const Icon: FC<IconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  spin = false,
  className,
  title,
  ...svgProps
}) => {
  const pixelSize = typeof size === 'number' ? size : sizePixelsMap[size] || 16;
  const normalizedName = name.toLowerCase().trim();

  const colorClass = colorClassesMap[color] || 'text-current';
  const spinClass = spin ? 'animate-spin' : '';
  const combinedClassName = clsx(
    'inline-block shrink-0 align-middle transition-colors',
    colorClass,
    spinClass,
    className,
  );

  const ariaProps = title ? { 'aria-label': title } : { 'aria-hidden': 'true' as const };

  // Check custom icon map first
  const CustomIcon = customIconMap[normalizedName];
  if (CustomIcon) {
    return (
      <CustomIcon
        width={pixelSize}
        height={pixelSize}
        className={combinedClassName}
        {...ariaProps}
        {...svgProps}
      />
    );
  }

  // Check Lucide icon map
  const LucideComponent = lucideIconMap[normalizedName];
  if (LucideComponent) {
    return (
      <LucideComponent
        size={pixelSize}
        className={combinedClassName}
        {...ariaProps}
        {...svgProps}
      />
    );
  }

  // Fallback to Box icon if unknown
  return <Box size={pixelSize} className={combinedClassName} {...ariaProps} {...svgProps} />;
};
