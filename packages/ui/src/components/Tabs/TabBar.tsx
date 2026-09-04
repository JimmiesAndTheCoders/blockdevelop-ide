import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { TabItem, type TabItemData } from './TabItem';
import { Icon } from '../Icon/Icon';

export interface TabBarProps {
  tabs: TabItemData[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose?: ((id: string) => void) | undefined;
  onNewTab?: (() => void) | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}

/**
 * IDE Document Tab Bar strip containing tab items, horizontal scroll area, new tab (+) button, and toolbar actions.
 */
export const TabBar: FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  actions,
  className,
}) => {
  return (
    <div
      role="tablist"
      className={clsx(
        'h-8 bg-workspace-dark border-b border-workspace-border flex items-center justify-between select-none shrink-0 font-sans overflow-hidden',
        className,
      )}
    >
      {/* Tab Scroll Area */}
      <div className="flex items-center overflow-x-auto overflow-y-hidden h-full min-w-0">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={onTabSelect}
            onClose={onTabClose}
          />
        ))}

        {/* New Tab Button */}
        {onNewTab && (
          <button
            type="button"
            onClick={onNewTab}
            aria-label="New tab"
            className="h-full px-2 flex items-center justify-center hover:bg-workspace-hover text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <Icon name="plus" size="xs" />
          </button>
        )}
      </div>

      {/* Right Bar Actions */}
      {actions && <div className="flex items-center gap-1 px-2 shrink-0">{actions}</div>}
    </div>
  );
};
