import { useState, type FC, type ReactNode, type MouseEvent } from 'react';
import type { TabNode } from 'flexlayout-react';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu/ContextMenu';
import { useContextMenu } from '../ContextMenu/useContextMenu';

export interface TabNodeHeaderProps {
  node?: TabNode | undefined;
  title?: string | undefined;
  icon?: string | ReactNode | undefined;
  isDirty?: boolean | undefined;
  isPinned?: boolean | undefined;
  isMaximized?: boolean | undefined;
  onClose?: (() => void) | undefined;
  onCloseOthers?: (() => void) | undefined;
  onMaximize?: (() => void) | undefined;
  onPin?: (() => void) | undefined;
  onSplitRight?: (() => void) | undefined;
  onSplitDown?: (() => void) | undefined;
  onFloat?: (() => void) | undefined;
  className?: string | undefined;
}

/**
 * Custom Tab Header Bar for dockable panels with title, dirty state, header actions, and right-click context menu.
 */
export const TabNodeHeader: FC<TabNodeHeaderProps> = ({
  node,
  title,
  icon,
  isDirty = false,
  isPinned = false,
  isMaximized = false,
  onClose,
  onCloseOthers,
  onMaximize,
  onPin,
  onSplitRight,
  onSplitDown,
  onFloat,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, position, handleContextMenu, closeContextMenu } = useContextMenu();

  const displayTitle = title || node?.getName() || 'Untitled Tab';
  const nodeIcon = icon || (node?.getIcon?.() as string | undefined);
  const isNodeDirty = isDirty || Boolean(node?.getExtraData?.()?.isDirty);

  const contextMenuItems: ContextMenuItem[] = [
    {
      id: 'close',
      label: 'Close Tab',
      icon: 'close',
      onClick: onClose,
      disabled: !onClose,
    },
    {
      id: 'close-others',
      label: 'Close Other Tabs',
      icon: 'trash',
      onClick: onCloseOthers,
      disabled: !onCloseOthers,
    },
    { id: 'div-1', divider: true },
    {
      id: 'split-right',
      label: 'Split Right',
      icon: 'chevron-right',
      onClick: onSplitRight,
      disabled: !onSplitRight,
    },
    {
      id: 'split-down',
      label: 'Split Down',
      icon: 'chevron-down',
      onClick: onSplitDown,
      disabled: !onSplitDown,
    },
    { id: 'div-2', divider: true },
    {
      id: 'float',
      label: 'Float Window',
      icon: 'layers',
      onClick: onFloat,
      disabled: !onFloat,
    },
  ];

  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="xs" color="muted" />;
    }
    return iconItem;
  };

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'inline-flex items-center justify-between gap-2 h-7 px-2 text-xs font-sans text-gray-300 select-none cursor-pointer transition-colors',
          isPinned && 'border-l-2 border-l-brand-blue bg-workspace-dark',
          className
        )}
      >
        {/* Left: Icon + Title + Dirty Indicator */}
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {nodeIcon && <span className="inline-flex shrink-0">{renderIconSlot(nodeIcon)}</span>}

          <span className="font-medium truncate text-gray-200">{displayTitle}</span>

          {isNodeDirty && (
            <span
              data-testid="tab-dirty-star"
              className="text-amber-400 font-bold text-xs shrink-0 leading-none"
              title="Unsaved changes"
            >
              *
            </span>
          )}
        </div>

        {/* Right: Header Actions */}
        <div className="flex items-center gap-0.5 shrink-0 ml-1">
          {onPin && (
            <button
              type="button"
              onClick={onPin}
              aria-label={isPinned ? 'Unpin tab' : 'Pin tab'}
              className={clsx(
                'p-0.5 rounded hover:bg-workspace-hover transition-colors',
                isPinned ? 'text-brand-blue' : 'text-gray-400 hover:text-white',
                isHovered || isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <Icon name="layers" size="xs" />
            </button>
          )}

          {onMaximize && (
            <button
              type="button"
              onClick={onMaximize}
              aria-label={isMaximized ? 'Restore tab' : 'Maximize tab'}
              className="p-0.5 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
            >
              <Icon name={isMaximized ? 'chevron-down' : 'chevron-up'} size="xs" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={handleCloseClick}
              aria-label={`Close tab ${displayTitle}`}
              className="p-0.5 rounded hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="close" size="xs" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Context Menu */}
      <ContextMenu
        isOpen={isOpen}
        position={position}
        onClose={closeContextMenu}
        items={contextMenuItems}
      />
    </>
  );
};
