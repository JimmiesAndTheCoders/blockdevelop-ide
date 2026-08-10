import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';

export const PreviewPanelView: FC<PanelProps> = ({ title = 'Live Preview', icon = 'globe' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-dark font-sans text-xs">
      <PanelHeader title={title} icon={icon} />
      <div className="flex-1 p-4 flex items-center justify-center text-gray-400 font-mono">
        🌐 Live HTML5 Canvas Standby...
      </div>
    </div>
  );
};
