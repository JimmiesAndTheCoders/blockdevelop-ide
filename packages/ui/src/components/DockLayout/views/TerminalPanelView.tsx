import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';

export const TerminalPanelView: FC<PanelProps> = ({ title = 'Terminal', icon = 'terminal' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-dark font-mono text-2xs select-none">
      <PanelHeader title={title} icon={icon} />
      <div className="flex-1 p-3 text-emerald-400 overflow-y-auto space-y-1">
        <div>[System] BlockDevelop IDE Engine Initialized.</div>
        <div className="text-gray-400">[Compiler] Ready for target: HTML5 Web App</div>
        <div className="text-brand-haxeOrange">$ haxe --version 4.3.3</div>
      </div>
    </div>
  );
};
