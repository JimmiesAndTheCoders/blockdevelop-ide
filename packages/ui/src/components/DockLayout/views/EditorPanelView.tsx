import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { Tag } from '../../Badge/Badge';
import { Button } from '../../Button/Button';

export const EditorPanelView: FC<PanelProps> = ({ title = 'Main.block' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-dark p-4 font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-workspace-border mb-4">
        <div className="flex items-center gap-2">
          <Tag variant="haxe">{title}</Tag>
          <span className="text-gray-400 text-2xs">Visual Block Editor Canvas</span>
        </div>
        <Button variant="accent" size="xs" leftIcon="play">
          Run Preview
        </Button>
      </div>

      <div className="flex-1 border border-workspace-border border-dashed rounded-lg bg-workspace-panel/50 p-6 flex items-center justify-center text-gray-400 font-mono">
        <div className="text-center space-y-2">
          <div className="text-brand-blue font-bold text-sm">🧩 Block Canvas Active</div>
          <div className="text-2xs text-gray-500">
            Drag and drop blocks from the Toolbox panel to build visual logic.
          </div>
        </div>
      </div>
    </div>
  );
};
