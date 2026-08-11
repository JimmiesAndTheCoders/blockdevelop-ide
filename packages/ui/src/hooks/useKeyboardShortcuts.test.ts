import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useLayoutStore, useEditorStore, useUIStore } from '@blockdevelop/core';

describe('useKeyboardShortcuts Navigation Suite', () => {
  beforeEach(() => {
    useLayoutStore.getState().resetLayout();
    useEditorStore.setState({
      tabs: [{ id: 'test-tab.hx', title: 'test-tab.hx', filePath: '/test-tab.hx', isDirty: false }],
      activeTabId: 'test-tab.hx',
    });
    useUIStore.setState({ isSidebarOpen: true });
  });

  it('Ctrl+B should toggle sidebar and explorer panel visibility', () => {
    renderHook(() => useKeyboardShortcuts());

    expect(useUIStore.getState().isSidebarOpen).toBe(true);

    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });

    expect(useUIStore.getState().isSidebarOpen).toBe(false);
    expect(useLayoutStore.getState().hiddenPanels).toContain('explorer');
  });

  it('Ctrl+` should toggle bottom terminal panel visibility', () => {
    renderHook(() => useKeyboardShortcuts());

    fireEvent.keyDown(window, { key: '`', ctrlKey: true });

    expect(useLayoutStore.getState().hiddenPanels).toContain('terminal-panel');

    fireEvent.keyDown(window, { key: '`', ctrlKey: true });

    expect(useLayoutStore.getState().hiddenPanels).not.toContain('terminal-panel');
  });

  it('Ctrl+Shift+E should open/focus explorer panel', () => {
    renderHook(() => useKeyboardShortcuts());

    useLayoutStore.getState().closePanel('explorer');
    expect(useLayoutStore.getState().hiddenPanels).toContain('explorer');

    fireEvent.keyDown(window, { key: 'e', ctrlKey: true, shiftKey: true });

    expect(useLayoutStore.getState().hiddenPanels).not.toContain('explorer');
    expect(useLayoutStore.getState().activeTabId).toBe('explorer');
  });

  it('Ctrl+W should close the active editor tab', () => {
    renderHook(() => useKeyboardShortcuts());

    expect(useEditorStore.getState().tabs.length).toBe(1);

    fireEvent.keyDown(window, { key: 'w', ctrlKey: true });

    expect(useEditorStore.getState().tabs.length).toBe(0);
  });
});
