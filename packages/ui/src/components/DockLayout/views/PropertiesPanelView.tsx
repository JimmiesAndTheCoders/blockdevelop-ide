import type { FC } from 'react';
import type { PanelProps } from '../panelTypes';
import { PanelHeader } from '../../Panel/PanelHeader';
import { PanelSection } from '../../Panel/PanelSection';
import { TextInput } from '../../Input/TextInput';

export const PropertiesPanelView: FC<PanelProps> = ({ title = 'Properties', icon = 'settings' }) => {
  return (
    <div className="flex flex-col h-full bg-workspace-panel font-sans text-xs select-none">
      <PanelHeader title={title} icon={icon} />
      <div className="flex-1 overflow-y-auto">
        <PanelSection title="Selected Block Inspector" icon="box">
          <div className="space-y-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-gray-400 font-medium">Block ID</label>
              <TextInput size="xs" defaultValue="block_01" disabled />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-gray-400 font-medium">Variable Name</label>
              <TextInput size="xs" defaultValue="playerScore" />
            </div>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};
