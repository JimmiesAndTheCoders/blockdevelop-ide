import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';
import { PanelSection } from '../../Panel/PanelSection';

export const ToolboxPanelView: FC<PanelProps> = ({ title = 'Block Toolbox', icon = 'box' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-panel font-sans text-xs select-none">
      <PanelHeader title={title} icon={icon} />
      <div className="flex-1 overflow-y-auto">
        <PanelSection title="Logic & Control" icon="code">
          <div className="space-y-1 pt-1 font-mono text-2xs">
            <div className="p-1.5 bg-blue-950/60 border border-blue-700/60 rounded text-blue-300 cursor-grab">
              If / Else Block
            </div>
            <div className="p-1.5 bg-emerald-950/60 border border-emerald-700/60 rounded text-emerald-300 cursor-grab">
              Repeat Loop
            </div>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};
