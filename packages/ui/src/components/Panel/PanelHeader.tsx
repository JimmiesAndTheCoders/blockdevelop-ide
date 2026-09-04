import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export interface PanelHeaderProps {
  title: ReactNode;
  icon?: string | ReactNode | undefined;
  badge?: ReactNode | undefined;
  isPinned?: boolean | undefined;
  onTogglePin?: (() => void) | undefined;
  isMaximized?: boolean | undefined;
  onToggleMaximize?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  onSettingsClick?: (() => void) | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}

/**
 * Standardized IDE Tool Window Header Bar (Explorer, Properties, Output, Blocks, Terminal).
 */
export const PanelHeader: FC<PanelHeaderProps> = ({
  title,
  icon,
  badge,
  isPinned,
  onTogglePin,
  isMaximized,
  onToggleMaximize,
  onClose,
  onSettingsClick,
  actions,
  className,
}) => {
  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="xs" color="muted" />;
    }
    return iconItem;
  };

  return (
    <div
      className={clsx(
        'h-7 px-2 bg-workspace-header border-b border-workspace-border flex items-center justify-between text-xs text-gray-300 select-none shrink-0 font-sans',
        className,
      )}
    >
      {/* Left: Title + Icon + Badge */}
      <div className="flex items-center gap-1.5 min-w-0 truncate">
        {icon && <span className="inline-flex shrink-0">{renderIconSlot(icon)}</span>}
        <span className="font-semibold text-2xs uppercase tracking-wider text-gray-200 truncate">
          {title}
        </span>
        {badge && <span className="inline-flex shrink-0">{badge}</span>}
      </div>

      {/* Right: Custom Toolbar Actions + Standard Panel Buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {actions && <div className="flex items-center gap-0.5 mr-1">{actions}</div>}

        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            aria-label="Panel settings"
            className="p-1 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="settings" size="xs" />
          </button>
        )}

        {onTogglePin && (
          <button
            type="button"
            onClick={onTogglePin}
            aria-label={isPinned ? 'Unpin panel' : 'Pin panel'}
            className={clsx(
              'p-1 rounded hover:bg-workspace-hover transition-colors',
              isPinned ? 'text-brand-blue' : 'text-gray-400 hover:text-white',
            )}
          >
            <Icon name="layers" size="xs" />
          </button>
        )}

        {onToggleMaximize && (
          <button
            type="button"
            onClick={onToggleMaximize}
            aria-label={isMaximized ? 'Restore panel' : 'Maximize panel'}
            className="p-1 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
          >
            <Icon name={isMaximized ? 'chevron-down' : 'chevron-up'} size="xs" />
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>
    </div>
  );
};
