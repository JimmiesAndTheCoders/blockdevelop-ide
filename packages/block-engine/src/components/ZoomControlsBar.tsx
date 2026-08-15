import React, { useEffect, useState, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import { Button, Tooltip } from '@blockdevelop/ui';

export interface ZoomControlsBarProps {
  workspace: Blockly.WorkspaceSvg | null;
  className?: string;
}

export const ZoomControlsBar: React.FC<ZoomControlsBarProps> = ({
  workspace,
  className = 'absolute bottom-4 right-24 z-30 flex items-center gap-1 bg-workspace-panel/90 backdrop-blur border border-workspace-border p-1 rounded-md shadow-lg',
}) => {
  const [currentZoomPercent, setCurrentZoomPercent] = useState<number>(100);

  useEffect(() => {
    if (!workspace) return;

    const updateScale = () => {
      const scale = workspace.scale;
      setCurrentZoomPercent(Math.round(scale * 100));
    };

    updateScale();

    const listener = (e: Blockly.Events.Abstract) => {
      if (e.type === Blockly.Events.VIEWPORT_CHANGE || e.type === 'viewport_change') {
        updateScale();
      }
    };

    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
    };
  }, [workspace]);

  // Zoom Actions
  const handleZoomIn = useCallback(() => {
    if (!workspace) return;
    workspace.zoomCenter(1);
    if (typeof workspace.markFocused === 'function') {
      workspace.markFocused();
    }
  }, [workspace]);

  const handleZoomOut = useCallback(() => {
    if (!workspace) return;
    workspace.zoomCenter(-1);
    if (typeof workspace.markFocused === 'function') {
      workspace.markFocused();
    }
  }, [workspace]);

  const handleResetZoom = useCallback(() => {
    if (!workspace) return;
    workspace.setScale(1.0);
    workspace.scrollCenter();
    if (typeof workspace.markFocused === 'function') {
      workspace.markFocused();
    }
  }, [workspace]);

  const handleFitToView = useCallback(() => {
    if (!workspace) return;
    workspace.zoomToFit();
    if (typeof workspace.markFocused === 'function') {
      workspace.markFocused();
    }
  }, [workspace]);

  // Global Keyboard Shortcuts Listener
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

      if (ctrlKey && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
        return;
      }

      if (e.shiftKey && e.key === '1') {
        e.preventDefault();
        handleFitToView();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [workspace, handleResetZoom, handleFitToView]);

  if (!workspace) {
    return null;
  }

  return (
    <div className={className} role="toolbar" aria-label="Workspace Zoom Controls">
      <Tooltip content="Zoom In" shortcut="+">
        <Button
          variant="ghost"
          size="xs"
          leftIcon="plus"
          onClick={handleZoomIn}
          aria-label="Zoom In"
        />
      </Tooltip>

      <Tooltip content="Zoom Out" shortcut="-">
        <Button
          variant="ghost"
          size="xs"
          leftIcon="minus"
          onClick={handleZoomOut}
          aria-label="Zoom Out"
        />
      </Tooltip>

      <Tooltip content="Reset Zoom to 100%" shortcut="Ctrl+0">
        <Button
          variant="ghost"
          size="xs"
          onClick={handleResetZoom}
          aria-label="Reset Zoom"
          className="font-mono text-2xs min-w-[48px]"
        >
          {currentZoomPercent}%
        </Button>
      </Tooltip>

      <div className="w-px h-4 bg-workspace-border my-auto mx-0.5" />

      <Tooltip content="Fit All Blocks to View" shortcut="Shift+1">
        <Button
          variant="ghost"
          size="xs"
          leftIcon="box"
          onClick={handleFitToView}
          aria-label="Fit All Blocks to View"
        />
      </Tooltip>
    </div>
  );
};
