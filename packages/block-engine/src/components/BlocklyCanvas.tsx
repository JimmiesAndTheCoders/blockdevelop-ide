import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import { createBlockDevelopDarkTheme, createIDEGridConfig, IDEGridOptions } from '../theme';
import { registerBlockDefinitions } from '../blocks';
import { DEFAULT_TOOLBOX_DEFINITION } from '../toolbox';
import { registerCustomContextMenuOptions } from '../contextmenu';
import { ZoomControlsBar } from './ZoomControlsBar';
import { WorkspaceMinimap } from './WorkspaceMinimap';
import { GridSnapToolbar } from './GridSnapToolbar';

export interface BlocklyCanvasProps {
  initialXml?: string;
  gridOptions?: IDEGridOptions;
  showZoomControls?: boolean;
  showMinimap?: boolean;
  showGridControls?: boolean;
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  className?: string;
}

export const BlocklyCanvas: React.FC<BlocklyCanvasProps> = ({
  gridOptions,
  showZoomControls = true,
  showMinimap = true,
  showGridControls = true,
  onWorkspaceChange,
  className = 'relative w-full h-full min-h-[400px]',
}: BlocklyCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    registerBlockDefinitions();
    registerCustomContextMenuOptions();
    const darkTheme = createBlockDevelopDarkTheme();
    const gridConfig = createIDEGridConfig(gridOptions);

    const ws = Blockly.inject(containerRef.current, {
      toolbox: DEFAULT_TOOLBOX_DEFINITION as unknown as Blockly.utils.toolbox.ToolboxDefinition,
      theme: darkTheme,
      grid: gridConfig,
      zoom: {
        controls: false, // Replaced by custom ZoomControlsBar HUD
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
        pinch: true,
      },
      move: {
        scrollbars: {
          horizontal: true,
          vertical: true,
        },
        drag: true,
        wheel: true,
      },
      trashcan: true,
    });

    setWorkspace(ws);

    const listener = () => {
      if (onWorkspaceChange) {
        onWorkspaceChange(ws);
      }
    };

    ws.addChangeListener(listener);

    return () => {
      ws.removeChangeListener(listener);
      ws.dispose();
      setWorkspace(null);
    };
  }, [gridOptions, onWorkspaceChange]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full" />
      {showGridControls && workspace && <GridSnapToolbar workspace={workspace} />}
      {showMinimap && workspace && <WorkspaceMinimap workspace={workspace} />}
      {showZoomControls && workspace && <ZoomControlsBar workspace={workspace} />}
    </div>
  );
};
