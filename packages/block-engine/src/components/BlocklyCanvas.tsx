import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import { ideEventBus, useUIStore, useEditorStore } from '@blockdevelop/core';
import { createBlockDevelopDarkTheme, createIDEGridConfig, IDEGridOptions } from '../theme';
import { registerBlockDefinitions } from '../blocks';
import { DEFAULT_TOOLBOX_DEFINITION } from '../toolbox';
import { registerCustomContextMenuOptions } from '../contextmenu';
import { ZoomControlsBar } from './ZoomControlsBar';
import { WorkspaceMinimap } from './WorkspaceMinimap';
import { GridSnapToolbar } from './GridSnapToolbar';

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

/**
 * React wrapper component managing Blockly Workspace SVG rendering, ResizeObserver auto-resizing,
 * state synchronization with @blockdevelop/core stores, ideEventBus events, and Undo/Redo stack handling.
 */
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

  const activeTabId = useEditorStore((state) => state.activeTabId);
  const currentFileId = fileId || activeTabId || 'main.block';

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

  // Keyboard Undo/Redo Shortcuts Listener (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
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

      // Ctrl+Z -> Undo
      if (ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z -> Redo
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

    // 1. Automatic ResizeObserver for responsive FlexLayout tab resizing
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (!isDisposed && ws) {
          Blockly.svgResize(ws);
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    // 2. Change Listeners for Workspace Events & Event Bus Sync
    const changeListener = (e: Blockly.Events.Abstract) => {
      if (isDisposed) return;

      if (onWorkspaceChange) {
        onWorkspaceChange(ws);
      }

      // Handle Block Selection Event & Store Sync
      if (e.type === Blockly.Events.SELECTED || e.type === 'selected') {
        const selectedEvent = e as unknown as { newElementId: string | null };
        const selectedId = selectedEvent.newElementId ?? null;

        if (selectedId) {
          const selectedBlock = ws.getBlockById(selectedId);
          const blockType = selectedBlock ? selectedBlock.type : 'unknown';

          // Emit block:selected event to ideEventBus
          ideEventBus.emit('block:selected', {
            blockId: selectedId,
            blockType,
          });

          // Sync status message with uiStore
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

      // Handle Block Change Event & Emit block:changed to ideEventBus
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

        // Emit block:changed event to ideEventBus
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

    // 3. Clean Lifecycle Cleanup on Unmount
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
    <div className={className}>
      <div ref={containerRef} className="w-full h-full" />
      {showGridControls && workspace && <GridSnapToolbar workspace={workspace} />}
      {showMinimap && workspace && <WorkspaceMinimap workspace={workspace} />}
      {showZoomControls && workspace && <ZoomControlsBar workspace={workspace} />}
    </div>
  );
};
