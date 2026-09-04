import { useState, type FC, type ReactNode, type MouseEvent } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';

export interface TabItemData {
  id: string;
  title: string;
  icon?: string | ReactNode | undefined;
  isDirty?: boolean | undefined;
  isPinned?: boolean | undefined;
  isDragging?: boolean | undefined;
  filePath?: string | undefined;
}

export interface TabItemProps {
  tab: TabItemData;
  isActive: boolean;
  onClick: (id: string) => void;
  onClose?: ((id: string) => void) | undefined;
  onMiddleClick?: ((id: string) => void) | undefined;
  className?: string | undefined;
}

/**
 * FlashDevelop-style IDE Editor Tab item supporting active indicators, unsaved dirty dot, hover close button, and middle-click closing.
 */
export const TabItem: FC<TabItemProps> = ({
  tab,
  isActive,
  onClick,
  onClose,
  onMiddleClick,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAuxClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 && (onMiddleClick || onClose)) {
      e.preventDefault();
      e.stopPropagation();
      if (onMiddleClick) {
        onMiddleClick(tab.id);
      } else if (onClose) {
        onClose(tab.id);
      }
    }
  };

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClose) {
      onClose(tab.id);
    }
  };

  const renderIconSlot = (iconItem: string | ReactNode) => {
    if (typeof iconItem === 'string') {
      return <Icon name={iconItem} size="xs" color={isActive ? 'primary' : 'muted'} />;
    }
    return iconItem;
  };

  return (
    <div
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      onClick={() => onClick(tab.id)}
      onAuxClick={handleAuxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={tab.filePath || tab.title}
      className={clsx(
        'group relative h-8 px-2.5 flex items-center gap-2 text-xs select-none cursor-pointer transition-colors border-r border-r-workspace-border/50 shrink-0 font-sans outline-none focus-visible:ring-1 focus-visible:ring-brand-blue',
        isActive
          ? 'bg-workspace-activeTab text-white font-medium border-t-2 border-t-brand-blue shadow-sm'
          : 'bg-workspace-tab hover:bg-workspace-hover text-gray-400 hover:text-gray-200 border-t-2 border-t-transparent',
        tab.isDragging && 'opacity-40 border-dashed border-brand-blue bg-workspace-dark',
        className,
      )}
    >
      {/* Tab Icon */}
      {tab.icon && <span className="inline-flex shrink-0">{renderIconSlot(tab.icon)}</span>}

      {/* Title */}
      <span className="truncate max-w-[140px]">{tab.title}</span>

      {/* Status / Close Button */}
      <div className="flex items-center justify-center w-4 h-4 shrink-0 ml-0.5">
        {tab.isDirty && !isHovered ? (
          <span
            data-testid="tab-dirty-dot"
            className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
            title="Unsaved changes"
          />
        ) : (
          onClose && (
            <button
              type="button"
              onClick={handleCloseClick}
              aria-label={`Close tab ${tab.title}`}
              className={clsx(
                'p-0.5 rounded hover:bg-workspace-border text-gray-400 hover:text-white transition-opacity',
                isHovered || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              <Icon name="close" size="xs" />
            </button>
          )
        )}
      </div>
    </div>
  );
};
