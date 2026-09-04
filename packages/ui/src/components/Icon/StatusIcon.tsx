import type { FC } from 'react';
import { clsx } from 'clsx';
import { Icon, IconProps } from './Icon';
import { Lock, RefreshCw, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type StatusOverlayType =
  'modified' | 'dirty' | 'lock' | 'readonly' | 'sync' | 'loading' | 'error' | 'warning' | 'success';

export type BadgePosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

export interface StatusIconProps extends IconProps {
  status?: StatusOverlayType | undefined;
  badgePosition?: BadgePosition | undefined;
  statusTitle?: string | undefined;
}

const positionClassesMap: Record<BadgePosition, string> = {
  'top-right': '-top-1 -right-1',
  'bottom-right': '-bottom-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-left': '-bottom-1 -left-1',
};

/**
 * StatusIcon wraps base Icon with status badge overlays (unsaved dot, lock, sync spinner, error/warning/success indicators).
 */
export const StatusIcon: FC<StatusIconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  status,
  badgePosition = 'bottom-right',
  statusTitle,
  className,
  ...iconProps
}) => {
  if (!status) {
    return <Icon name={name} size={size} color={color} className={className} {...iconProps} />;
  }

  const badgePositionClass = positionClassesMap[badgePosition];

  const renderBadgeContent = () => {
    switch (status) {
      case 'modified':
      case 'dirty':
        return (
          <span
            data-testid="status-badge-modified"
            className="block w-2 h-2 rounded-full bg-amber-400 ring-2 ring-workspace-dark"
          />
        );
      case 'lock':
      case 'readonly':
        return (
          <Lock
            data-testid="status-badge-lock"
            size={10}
            className="text-gray-300 fill-workspace-panel"
          />
        );
      case 'sync':
      case 'loading':
        return (
          <RefreshCw
            data-testid="status-badge-loading"
            size={10}
            className="text-brand-blue animate-spin"
          />
        );
      case 'error':
        return (
          <AlertCircle
            data-testid="status-badge-error"
            size={10}
            className="text-status-error fill-status-errorBg"
          />
        );
      case 'warning':
        return (
          <AlertTriangle
            data-testid="status-badge-warning"
            size={10}
            className="text-status-warning fill-status-warningBg"
          />
        );
      case 'success':
        return (
          <CheckCircle2
            data-testid="status-badge-success"
            size={10}
            className="text-status-success fill-status-successBg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center shrink-0', className)}
      title={statusTitle}
    >
      <Icon name={name} size={size} color={color} {...iconProps} />
      <div
        className={clsx(
          'absolute pointer-events-none flex items-center justify-center',
          badgePositionClass,
        )}
      >
        {renderBadgeContent()}
      </div>
    </div>
  );
};
