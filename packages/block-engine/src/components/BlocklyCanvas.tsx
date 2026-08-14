import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';

import { ideEventBus, useUIStore, useEditorStore } from '@blockdevelop/core';
import { ContextMenu, useContextMenu, type ContextMenuItem } from '@blockdevelop/ui';
import { createBlockDevelopDarkTheme, createIDEGridConfig, IDEGridOptions } from '../theme';
import { registerBlockDefinitions } from '../blocks';
import { DEFAULT_TOOLBOX_DEFINITION } from '../toolbox';
import { registerCustomContextMenuOptions, buildIDEContextMenuItems } from '../contextmenu';
import { ZoomControlsBar } from './ZoomControlsBar';
import { WorkspaceMinimap } from './WorkspaceMinimap';
import { GridSnapToolbar } from './GridSnapToolbar';

// Ensure English locale is set
Blockly.setLocale(En as unknown as Record<string, string>);

// Suppress Blockly's default unstyled context menu in favor of @blockdevelop/ui ContextMenu
Blockly.ContextMenu.show = () => {};

// Default prompt dialog handler for "Create a Variable" button
if (typeof Blockly.dialog?.setPrompt === 'function') {
  Blockly.dialog.setPrompt((message, defaultValue, callback) => {
    const result = prompt(message, defaultValue);
    callback(result);
  });
}

export interface BlocklyCanvasProps {
  fileId?: string;
  initialXml?: string;
  gridOptions?: IDEGridOptions;
  showZoomControls?: boolean;
  showMinimap?: boolean;
  showGridControls?: boolean;
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  onBlockSelect?: (blockId: string | null) => void;
  onXmlChange?: (xmlText: string) => void;
  className?: string;
}

export const BlocklyCanvas: React.FC<BlocklyCanvasProps> = ({
  fileId,
  gridOptions,
  showZoomControls = true,
  showMinimap = true,
  showGridControls = true,
  onWorkspaceChange,
  onBlockSelect,
  onXmlChange,
  className = 'relative w-full h-full min-h-[400px]',
}: BlocklyCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);

  const { isOpen, position, handleContextMenu: openContextMenu, closeContextMenu } = useContextMenu();
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);

  const activeTabId = useEditorStore((state) => state.activeTabId);
  const currentFileId = fileId || activeTabId || 'main.block';

  // Handle right-click on Blockly Canvas to display single IDE ContextMenu
  const handleCanvasContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!workspace) return;

      let targetBlock: Blockly.BlockSvg | undefined = undefined;
      const selected = Blockly.common.getSelected() as Blockly.BlockSvg | null;
      if (selected && selected.workspace === workspace) {
        targetBlock = selected;
      }

      const items = buildIDEContextMenuItems({
        block: targetBlock,
        workspace,
      });

      setContextMenuItems(items);
      openContextMenu(e);
    },
    [workspace, openContextMenu]
  );

  // Keyboard Undo/Redo Actions
  const handleUndo = useCallback(() => {
    if (workspace) {
      workspace.undo(false);
      useUIStore.getState().setStatusMessage('Workspace action undone.');
    }
  }, [workspace]);

  const handleRedo = useCallback(() => {
    if (workspace) {
      workspace.undo(true);
      useUIStore.getState().setStatusMessage('Workspace action redone.');
    }
  }, [workspace]);

  useEffect(() => {
    if (!workspace) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const ctrlKey = e.ctrlKey || e.metaKey;

      if (ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      if (
        (ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'y') ||
        (ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [workspace, handleUndo, handleRedo]);

  useEffect(() => {
    if (!containerRef.current) return;

    let isDisposed = false;

    registerBlockDefinitions();
    registerCustomContextMenuOptions();
    const darkTheme = createBlockDevelopDarkTheme();
    const gridConfig = createIDEGridConfig(gridOptions);

    const ws = Blockly.inject(containerRef.current, {
      toolbox: DEFAULT_TOOLBOX_DEFINITION as unknown as Blockly.utils.toolbox.ToolboxDefinition,
      theme: darkTheme,
      grid: gridConfig,
      zoom: {
        controls: false,
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
        wheel: false,
      },
      trashcan: true,
    });

    setWorkspace(ws);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (!isDisposed && ws) {
          Blockly.svgResize(ws);
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    const changeListener = (e: Blockly.Events.Abstract) => {
      if (isDisposed) return;

      if (onWorkspaceChange) {
        onWorkspaceChange(ws);
      }

      if (e.type === Blockly.Events.SELECTED || e.type === 'selected') {
        const selectedEvent = e as unknown as { newElementId: string | null };
        const selectedId = selectedEvent.newElementId ?? null;

        if (selectedId) {
          const selectedBlock = ws.getBlockById(selectedId);
          const blockType = selectedBlock ? selectedBlock.type : 'unknown';

          ideEventBus.emit('block:selected', {
            blockId: selectedId,
            blockType,
          });

          useUIStore
            .getState()
            .setStatusMessage(`Selected Block: ${blockType} [${selectedId.substring(0, 6)}]`);
        } else {
          useUIStore.getState().setStatusMessage('Workspace Ready');
        }

        if (onBlockSelect) {
          onBlockSelect(selectedId);
        }
      }

      if (
        e.type === Blockly.Events.BLOCK_CHANGE ||
        e.type === Blockly.Events.BLOCK_CREATE ||
        e.type === Blockly.Events.BLOCK_DELETE ||
        e.type === Blockly.Events.BLOCK_MOVE ||
        e.type === 'change' ||
        e.type === 'create' ||
        e.type === 'delete' ||
        e.type === 'move'
      ) {
        const allBlocks = ws.getAllBlocks(false);
        const blockCount = allBlocks.length;

        ideEventBus.emit('block:changed', {
          fileId: currentFileId,
          blockCount,
        });

        if (onXmlChange) {
          try {
            const xmlDom = Blockly.Xml.workspaceToDom(ws);
            const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
            onXmlChange(xmlText);
          } catch (err) {
            console.error('[BlocklyCanvas] Failed to serialize workspace XML:', err);
          }
        }
      }
    };

    ws.addChangeListener(changeListener);

    return () => {
      isDisposed = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      ws.removeChangeListener(changeListener);
      ws.dispose();
      setWorkspace(null);
    };
  }, [gridOptions, currentFileId, onWorkspaceChange, onBlockSelect, onXmlChange]);

  return (
    <div className={className} onContextMenu={handleCanvasContextMenu}>
      <div ref={containerRef} className="w-full h-full" />
      {showGridControls && workspace && <GridSnapToolbar workspace={workspace} />}
      {showMinimap && workspace && <WorkspaceMinimap workspace={workspace} />}
      {showZoomControls && workspace && <ZoomControlsBar workspace={workspace} />}

      {/* Custom IDE Context Menu */}
      <ContextMenu
        isOpen={isOpen}
        position={position}
        onClose={closeContextMenu}
        items={contextMenuItems}
      />
    </div>
  );
};
