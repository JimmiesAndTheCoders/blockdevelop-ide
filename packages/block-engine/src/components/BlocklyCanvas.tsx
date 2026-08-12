import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { createBlockDevelopDarkTheme, createIDEGridConfig, IDEGridOptions } from '../theme';
import { registerBlockDefinitions } from '../blocks';
import { DEFAULT_TOOLBOX_DEFINITION } from '../toolbox';
import { registerCustomContextMenuOptions } from '../contextmenu';

export interface BlocklyCanvasProps {
  initialXml?: string;
  gridOptions?: IDEGridOptions;
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  className?: string;
}

export const BlocklyCanvas: React.FC<BlocklyCanvasProps> = ({
  gridOptions,
  onWorkspaceChange,
  className = 'w-full h-full min-h-[400px]',
}: BlocklyCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    registerBlockDefinitions();
    registerCustomContextMenuOptions();
    const darkTheme = createBlockDevelopDarkTheme();
    const gridConfig = createIDEGridConfig(gridOptions);

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: DEFAULT_TOOLBOX_DEFINITION as unknown as Blockly.utils.toolbox.ToolboxDefinition,
      theme: darkTheme,
      grid: gridConfig,
      zoom: {
        controls: true,
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

    workspaceRef.current = workspace;

    const listener = () => {
      if (onWorkspaceChange && workspaceRef.current) {
        onWorkspaceChange(workspaceRef.current);
      }
    };

    workspace.addChangeListener(listener);

    return () => {
      workspace.removeChangeListener(listener);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [gridOptions, onWorkspaceChange]);

  return <div ref={containerRef} className={className} />;
};
