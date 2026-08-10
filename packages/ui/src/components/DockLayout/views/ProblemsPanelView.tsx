import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';
import { Badge } from '../../Badge/Badge';

export const ProblemsPanelView: FC<PanelProps> = ({ title = 'Problems & Diagnostics', icon = 'bug' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-panel font-sans text-xs select-none">
      <PanelHeader
        title={title}
        icon={icon}
        badge={<Badge variant="success" size="xs">0 Errors</Badge>}
      />
      <div className="flex-1 p-3 text-gray-400 text-2xs flex items-center justify-center font-mono">
        ✓ No problems or diagnostics detected in project.
      </div>
    </div>
  );
};
