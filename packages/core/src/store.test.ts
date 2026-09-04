import { describe, it, expect, beforeEach } from 'vitest';
import {
  useProjectStore,
  useUIStore,
  useEditorStore,
  useTerminalStore,
  useLayoutStore,
} from './store';

describe('State Store Initial State Sanity Suite', () => {
  beforeEach(() => {
    useProjectStore.getState().closeProject();
    useUIStore.getState().setTheme('dark');
    useEditorStore.getState().setZoomLevel(1.0);
    useTerminalStore.getState().clearLogs();
    useLayoutStore.getState().resetLayout();
  });

  it('should initialize useProjectStore with closed project defaults', () => {
    const state = useProjectStore.getState();
    expect(state.isProjectOpen).toBe(false);
    expect(state.activeProjectPath).toBeNull();
    expect(state.targetPlatform).toBe('html5');
  });

  it('should update target platform in useProjectStore', () => {
    useProjectStore.getState().setTargetPlatform('python');
    expect(useProjectStore.getState().targetPlatform).toBe('python');
  });

  it('should initialize useUIStore with dark theme defaults', () => {
    const state = useUIStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.statusMessage).toBe('Ready');
  });

  it('should initialize useEditorStore with empty tab list', () => {
    const state = useEditorStore.getState();
    expect(state.tabs).toEqual([]);
    expect(state.zoomLevel).toBe(1.0);
  });

  it('should initialize useTerminalStore and append log entries', () => {
    const store = useTerminalStore.getState();
    expect(store.logs).toEqual([]);

    store.appendLog('Test log message', 'stdout');
    expect(useTerminalStore.getState().logs.length).toBe(1);
    expect(useTerminalStore.getState().logs[0]?.text).toBe('Test log message');
  });

  it('should initialize useLayoutStore with default null layout state', () => {
    const state = useLayoutStore.getState();
    expect(state.layoutModel).toBeNull();
    expect(state.activeTabId).toBeNull();
    expect(state.hiddenPanels).toEqual([]);
  });
});
