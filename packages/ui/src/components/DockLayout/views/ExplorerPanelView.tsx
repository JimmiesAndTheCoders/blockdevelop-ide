import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';
import { PanelSection } from '../../Panel/PanelSection';
import { SearchInput } from '../../Input/SearchInput';
import { Badge } from '../../Badge/Badge';

export const ExplorerPanelView: FC<PanelProps> = ({
  title = 'Project Explorer',
  icon = 'folder',
}) => {
  return (
    <div className="flex flex-col h-full bg-workspace-panel font-sans text-xs select-none">
      <PanelHeader
        title={title}
        icon={icon}
        badge={
          <Badge variant="platform" size="xs">
            HAXE
          </Badge>
        }
      />
      <div className="p-2 border-b border-workspace-border">
        <SearchInput size="xs" placeholder="Search project files..." />
      </div>
      <div className="flex-1 overflow-y-auto">
        <PanelSection title="Source Files" icon="folder-open">
          <div className="space-y-1 font-mono text-2xs text-gray-300">
            <div className="p-1 hover:bg-workspace-hover rounded cursor-pointer text-cyan-300 font-semibold">
              📄 Main.block
            </div>
            <div className="p-1 hover:bg-workspace-hover rounded cursor-pointer text-gray-400">
              📄 Player.block
            </div>
            <div className="p-1 hover:bg-workspace-hover rounded cursor-pointer text-gray-400">
              📄 Utils.hx
            </div>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};
