import { useState, type FC, type ReactNode, type KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export interface PanelSectionProps {
  title: ReactNode;
  icon?: string | ReactNode | undefined;
  badge?: ReactNode | undefined;
  defaultCollapsed?: boolean | undefined;
  isCollapsed?: boolean | undefined;
  onToggleCollapse?: ((collapsed: boolean) => void) | undefined;
  actions?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  headerClassName?: string | undefined;
  bodyClassName?: string | undefined;
}

/**
 * Collapsible section accordion primitive for IDE tool window sub-views (e.g. Project Files, Dependencies, Properties).
 */
export const PanelSection: FC<PanelSectionProps> = ({
  title,
  icon,
  badge,
  defaultCollapsed = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const collapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const nextState = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(nextState);
    }
    if (onToggleCollapse) {
      onToggleCollapse(nextState);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="xs" color="muted" />;
    }
    return iconItem;
  };

  return (
    <div className={clsx('flex flex-col border-b border-workspace-border font-sans', className)}>
      {/* Section Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={clsx(
          'h-6 px-2 bg-workspace-dark hover:bg-workspace-hover border-b border-workspace-border/50 flex items-center justify-between text-2xs text-gray-300 font-semibold uppercase tracking-wider select-none cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue',
          headerClassName
        )}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          <Icon
            name="chevron-right"
            size="xs"
            color="muted"
            className={clsx('transition-transform duration-150 shrink-0', !collapsed && 'rotate-90')}
          />
          {icon && <span className="inline-flex shrink-0">{renderIconSlot(icon)}</span>}
          <span className="truncate text-gray-200">{title}</span>
          {badge && <span className="inline-flex shrink-0">{badge}</span>}
        </div>

        {actions && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 shrink-0"
          >
            {actions}
          </div>
        )}
      </div>

      {/* Section Body */}
      {!collapsed && children && (
        <div className={clsx('p-2 text-xs text-gray-200 bg-workspace-panel', bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  );
};
