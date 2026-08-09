import { useState, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { type ContextMenuPosition } from './ContextMenu';

export interface UseContextMenuResult {
  isOpen: boolean;
  position: ContextMenuPosition;
  handleContextMenu: (e: ReactMouseEvent) => void;
  closeContextMenu: () => void;
}

/**
 * Hook to manage right-click context menu state and mouse position coordinates.
 */
export function useContextMenu(): UseContextMenuResult {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  const closeContextMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    position,
    handleContextMenu,
    closeContextMenu,
  };
}
