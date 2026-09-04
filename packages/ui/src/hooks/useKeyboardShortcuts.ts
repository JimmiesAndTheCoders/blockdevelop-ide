import { useEffect } from 'react';
import { useLayoutStore, useEditorStore, useUIStore } from '@blockdevelop/core';

/**
 * Global IDE Keyboard Shortcuts Navigation Hook
 * Registers shortcuts for panel toggling, explorer focusing, and tab closing:
 * - Ctrl+B / Cmd+B -> Toggle Left Sidebar / Explorer
 * - Ctrl+` / Cmd+` -> Toggle Bottom Terminal Panel
 * - Ctrl+Shift+E / Cmd+Shift+E -> Focus Explorer Panel
 * - Ctrl+W / Cmd+W -> Close Active Tab
 */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac =
        typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // 1. Ctrl+B / Cmd+B -> Toggle Left Sidebar / Explorer Panel
      if (ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
        useLayoutStore.getState().togglePanel('explorer');
        return;
      }

      // 2. Ctrl+` / Cmd+` -> Toggle Bottom Terminal Panel
      if (ctrlKey && !e.shiftKey && !e.altKey && e.key === '`') {
        e.preventDefault();
        useLayoutStore.getState().togglePanel('terminal-panel');
        return;
      }

      // 3. Ctrl+Shift+E / Cmd+Shift+E -> Focus Explorer Panel
      if (ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        useLayoutStore.getState().openPanel('explorer');
        return;
      }

      // 4. Ctrl+W / Cmd+W -> Close Active Editor / Panel Tab
      if (ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        const activeTabId =
          useEditorStore.getState().activeTabId || useLayoutStore.getState().activeTabId;

        if (activeTabId) {
          useEditorStore.getState().closeTab(activeTabId);
          useLayoutStore.getState().closePanel(activeTabId);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
