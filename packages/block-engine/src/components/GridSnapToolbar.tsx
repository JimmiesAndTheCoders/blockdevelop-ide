import React, { useState, useCallback } from 'react';
import type * as Blockly from 'blockly/core';
import { Button, Tooltip, Select } from '@blockdevelop/ui';
import { updateWorkspaceGrid, type GridDisplayMode } from '../theme/grid';

export interface GridSnapToolbarProps {
  workspace: Blockly.WorkspaceSvg | null;
  className?: string;
}

/**
 * High-density Grid Visibility & Snap Spacing HUD Toolbar overlay.
 */
export const GridSnapToolbar: React.FC<GridSnapToolbarProps> = ({
  workspace,
  className = 'absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-workspace-panel/90 backdrop-blur border border-workspace-border p-1 rounded-md shadow-lg text-xs text-gray-200 select-none',
}) => {
  const [gridMode, setGridMode] = useState<GridDisplayMode>('dots');
  const [isSnapEnabled, setIsSnapEnabled] = useState<boolean>(true);
  const [spacingResolution, setSpacingResolution] = useState<string>('20');

  const handleToggleGridMode = useCallback(() => {
    if (!workspace) return;
    const nextMode: GridDisplayMode =
      gridMode === 'dots' ? 'lines' : gridMode === 'lines' ? 'hidden' : 'dots';

    setGridMode(nextMode);
    updateWorkspaceGrid(workspace, { mode: nextMode });
  }, [workspace, gridMode]);

  const handleToggleSnap = useCallback(() => {
    if (!workspace) return;
    const nextSnap = !isSnapEnabled;
    setIsSnapEnabled(nextSnap);
    updateWorkspaceGrid(workspace, { snap: nextSnap });
  }, [workspace, isSnapEnabled]);

  const handleSpacingChange = useCallback(
    (newSpacingStr: string) => {
      if (!workspace) return;
      setSpacingResolution(newSpacingStr);
      const parsedSpacing = parseInt(newSpacingStr, 10);
      if (!Number.isNaN(parsedSpacing) && parsedSpacing > 0) {
        updateWorkspaceGrid(workspace, { spacing: parsedSpacing });
      }
    },
    [workspace]
  );

  if (!workspace) {
    return null;
  }

  const gridIcon = gridMode === 'dots' ? 'box' : gridMode === 'lines' ? 'layers' : 'eye-off';

  return (
    <div className={className} role="toolbar" aria-label="Grid and Snap Controls">
      {/* Grid Mode Toggle Button (Dots / Lines / Hidden) */}
      <Tooltip content={`Grid Mode: ${gridMode.toUpperCase()}`}>
        <Button
          variant={gridMode === 'hidden' ? 'ghost' : 'secondary'}
          size="xs"
          leftIcon={gridIcon}
          onClick={handleToggleGridMode}
          aria-label="Toggle Grid Visibility"
        >
          {gridMode.toUpperCase()}
        </Button>
      </Tooltip>

      {/* Snap-to-Grid Toggle Button */}
      <Tooltip content={isSnapEnabled ? 'Snap-to-Grid Enabled' : 'Snap-to-Grid Disabled'}>
        <Button
          variant={isSnapEnabled ? 'primary' : 'ghost'}
          size="xs"
          leftIcon="check"
          onClick={handleToggleSnap}
          aria-label="Toggle Snap to Grid"
        >
          {isSnapEnabled ? 'SNAP ON' : 'SNAP OFF'}
        </Button>
      </Tooltip>

      {/* Grid Spacing Resolution Dropdown */}
      <Select
        size="xs"
        value={spacingResolution}
        onChange={handleSpacingChange}
        options={[
          { value: '10', label: '10px' },
          { value: '20', label: '20px (Default)' },
          { value: '30', label: '30px' },
          { value: '40', label: '40px' },
        ]}
        className="w-28"
      />
    </div>
  );
};
