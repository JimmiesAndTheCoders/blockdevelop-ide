import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  type FC,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export interface ContextMenuItem {
  id: string;
  label?: string | undefined;
  icon?: string | ReactNode | undefined;
  shortcut?: string | undefined;
  disabled?: boolean | undefined;
  danger?: boolean | undefined;
  divider?: boolean | undefined;
  children?: ContextMenuItem[] | undefined;
  onClick?: (() => void) | undefined;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  onClose: () => void;
  items: ContextMenuItem[];
  className?: string | undefined;
}

/**
 * IDE Right-Click Context Menu Engine with auto-positioning, section dividers, sub-menus, icons, and keyboard shortcut labels.
 */
export const ContextMenu: FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  items,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<ContextMenuPosition>(position);
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);

  // Auto-positioning to prevent viewport boundary overflow
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    if (x + rect.width > viewportWidth - 8) {
      x = Math.max(8, viewportWidth - rect.width - 8);
    }

    if (y + rect.height > viewportHeight - 8) {
      y = Math.max(8, viewportHeight - rect.height - 8);
    }

    setAdjustedPosition({ x, y });
  }, [isOpen, position.x, position.y]);

  // Event listeners for ESC key, click-outside, and scroll dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const handleItemClick = (e: ReactMouseEvent, item: ContextMenuItem) => {
    e.stopPropagation();
    if (item.disabled || item.divider || item.children) return;

    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="sm" color="inherit" />;
    }
    return iconItem;
  };

  const renderMenu = (menuItems: ContextMenuItem[], isSubmenu = false) => (
    <div
      role="menu"
      className={clsx(
        'flex flex-col bg-workspace-panel border border-workspace-border rounded-md shadow-ide-dropdown py-1 text-xs text-gray-200 select-none min-w-[160px] animate-in fade-in duration-100 z-[100]',
        isSubmenu ? 'absolute top-0 left-full -ml-1' : '',
        className
      )}
    >
      {menuItems.map((item) => {
        if (item.divider) {
          return (
            <div
              key={item.id}
              role="separator"
              className="my-1 border-t border-workspace-border"
            />
          );
        }

        const hasSubmenu = Boolean(item.children && item.children.length > 0);
        const isSubmenuOpen = activeSubmenuId === item.id;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => hasSubmenu && setActiveSubmenuId(item.id)}
            onMouseLeave={() => hasSubmenu && setActiveSubmenuId(null)}
          >
            <div
              role="menuitem"
              aria-disabled={item.disabled}
              onClick={(e) => handleItemClick(e, item)}
              className={clsx(
                'flex items-center justify-between px-2.5 py-1.5 cursor-pointer transition-colors gap-4',
                item.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : item.danger
                  ? 'text-red-400 hover:bg-red-950/60 hover:text-red-300'
                  : 'hover:bg-workspace-hover text-gray-200 hover:text-white'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {item.icon ? (
                  <span className="inline-flex shrink-0">{renderIconSlot(item.icon)}</span>
                ) : (
                  <span className="w-4 shrink-0" />
                )}
                <span className="truncate font-medium">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.shortcut && (
                  <kbd className="px-1 text-2xs font-mono text-gray-400 bg-workspace-dark border border-workspace-border rounded leading-none">
                    {item.shortcut}
                  </kbd>
                )}

                {hasSubmenu && <Icon name="chevron-right" size="xs" color="muted" />}
              </div>
            </div>

            {hasSubmenu && isSubmenuOpen && item.children && renderMenu(item.children, true)}
          </div>
        );
      })}
    </div>
  );

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        zIndex: 9999,
      }}
    >
      {renderMenu(items)}
    </div>,
    document.body
  );
};
