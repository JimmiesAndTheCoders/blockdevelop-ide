import React, { useEffect, useRef, useState, useCallback } from 'react';
import type * as Blockly from 'blockly/core';

export interface WorkspaceMinimapProps {
  workspace: Blockly.WorkspaceSvg | null;
  width?: number;
  height?: number;
  className?: string;
}

export const WorkspaceMinimap: React.FC<WorkspaceMinimapProps> = ({
  workspace,
  width = 160,
  height = 100,
  className = 'absolute top-16 right-4 z-30 bg-workspace-panel/90 backdrop-blur border border-workspace-border rounded-md shadow-lg overflow-hidden select-none',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Bounds & Scale state maintained for mouse coordinate mapping
  const minimapScaleRef = useRef<{
    scale: number;
    offsetX: number;
    offsetY: number;
    viewRect: { x: number; y: number; width: number; height: number };
  }>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    viewRect: { x: 0, y: 0, width: 0, height: 0 },
  });

  const renderMinimap = useCallback(() => {
    if (!workspace || !canvasRef.current || isCollapsed) return;

    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, width, height);

    // Grid lines accent
    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    try {
      const metricsManager = workspace.getMetricsManager();
      const viewMetrics = metricsManager.getViewMetrics();
      const contentMetrics = metricsManager.getContentMetrics();

      // Combine blocks content bounds + camera view bounds
      const minX = Math.min(contentMetrics.left, viewMetrics.left) - 100;
      const minY = Math.min(contentMetrics.top, viewMetrics.top) - 100;
      const maxX = Math.max(contentMetrics.left + contentMetrics.width, viewMetrics.left + viewMetrics.width) + 100;
      const maxY = Math.max(contentMetrics.top + contentMetrics.height, viewMetrics.top + viewMetrics.height) + 100;

      const totalWidth = Math.max(maxX - minX, 200);
      const totalHeight = Math.max(maxY - minY, 200);

      const scaleX = width / totalWidth;
      const scaleY = height / totalHeight;
      const mapScale = Math.min(scaleX, scaleY);

      minimapScaleRef.current = {
        scale: mapScale,
        offsetX: minX,
        offsetY: minY,
        viewRect: {
          x: viewMetrics.left,
          y: viewMetrics.top,
          width: viewMetrics.width,
          height: viewMetrics.height,
        },
      };

      // Draw Mini Representation of Top-Level Blocks
      const topBlocks = workspace.getTopBlocks(false);
      ctx.fillStyle = '#007acc';

      topBlocks.forEach((block) => {
        const svgBlock = block as Blockly.BlockSvg;
        const pos = svgBlock.getRelativeToSurfaceXY();
        const size = svgBlock.getHeightWidth();

        const bx = (pos.x - minX) * mapScale;
        const by = (pos.y - minY) * mapScale;
        const bw = Math.max(size.width * mapScale, 4);
        const bh = Math.max(size.height * mapScale, 3);

        ctx.fillRect(bx, by, bw, bh);
      });

      // Draw Camera Viewport Rectangle Overlay
      const vx = (viewMetrics.left - minX) * mapScale;
      const vy = (viewMetrics.top - minY) * mapScale;
      const vw = Math.max(viewMetrics.width * mapScale, 10);
      const vh = Math.max(viewMetrics.height * mapScale, 10);

      // Viewport fill & stroke
      ctx.fillStyle = 'rgba(0, 122, 204, 0.25)';
      ctx.fillRect(vx, vy, vw, vh);

      ctx.strokeStyle = '#007acc';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(vx, vy, vw, vh);
    } catch {
      // Graceful fallback if workspace metrics not fully initialized
    }
  }, [workspace, width, height, isCollapsed]);

  // Listener for workspace events
  useEffect(() => {
    if (!workspace) return;

    renderMinimap();

    const listener = () => {
      renderMinimap();
    };

    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
    };
  }, [workspace, renderMinimap]);

  // Drag-to-pan Mouse Handlers
  const handlePanToCoords = (clientX: number, clientY: number) => {
    if (!workspace || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const { scale, offsetX, offsetY, viewRect } = minimapScaleRef.current;
    if (scale <= 0) return;

    // Convert minimap click coords back to workspace world coords
    const targetWorldX = clickX / scale + offsetX - viewRect.width / 2;
    const targetWorldY = clickY / scale + offsetY - viewRect.height / 2;

    workspace.scroll(targetWorldX, targetWorldY);
    renderMinimap();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    handlePanToCoords(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      handlePanToCoords(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  if (!workspace) {
    return null;
  }

  return (
    <div className={className}>
      {/* Header bar to toggle minimap expand/collapse */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-workspace-header text-2xs text-gray-300 font-semibold border-b border-workspace-border">
        <span>Minimap</span>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? 'Expand Minimap' : 'Collapse Minimap'}
        >
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>

      {!isCollapsed && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          aria-label="Workspace Minimap Canvas"
          className="cursor-crosshair block"
        />
      )}
    </div>
  );
};
