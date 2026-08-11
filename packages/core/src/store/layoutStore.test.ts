import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLayoutStore, setupLayoutEventListeners, SerializedLayoutModel } from './layoutStore';
import { useEditorStore } from './editorStore';
import { ideEventBus } from '../events/eventBus';

const mockLayoutJson: SerializedLayoutModel = {
  global: { tabEnableClose: true },
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        children: [{ type: 'tab', name: 'Explorer', component: 'explorer', id: 'explorer' }],
      },
    ],
  },
};

describe('useLayoutStore & Event Bus Integration', () => {
  let unsubscribeEvents: (() => void) | null = null;

  beforeEach(() => {
    useLayoutStore.getState().resetLayout();
    useEditorStore.setState({ tabs: [], activeTabId: null });
    unsubscribeEvents = setupLayoutEventListeners();
  });

  afterEach(() => {
    if (unsubscribeEvents) {
      unsubscribeEvents();
    }
  });

  it('should initialize with null layoutModel and empty state', () => {
    const state = useLayoutStore.getState();
    expect(state.layoutModel).toBeNull();
    expect(state.activeTabId).toBeNull();
    expect(state.hiddenPanels).toEqual([]);
  });

  it('should load and save layout models correctly', () => {
    useLayoutStore.getState().loadLayout(mockLayoutJson);
    const loadedState = useLayoutStore.getState();

    expect(loadedState.layoutModel).toEqual(mockLayoutJson);

    const saved = useLayoutStore.getState().saveLayout();
    expect(saved).toEqual(mockLayoutJson);
  });

  it('should auto-recover cleanly when loadLayout receives corrupted non-object parameter', () => {
    useLayoutStore.getState().loadLayout('corrupted_string_value' as unknown as SerializedLayoutModel);

    const state = useLayoutStore.getState();
    expect(state.layoutModel).toBeNull();
    expect(state.hiddenPanels).toEqual([]);
  });

  it('should open panel and set active tab while unhiding', () => {
    useLayoutStore.getState().setHiddenPanels(['terminal', 'explorer']);
    useLayoutStore.getState().openPanel('terminal');

    const state = useLayoutStore.getState();
    expect(state.hiddenPanels).toEqual(['explorer']);
    expect(state.activeTabId).toBe('terminal');
  });

  it('should close panel and clear active tab if it matches', () => {
    useLayoutStore.getState().setActiveTab('terminal');
    useLayoutStore.getState().closePanel('terminal');

    const state = useLayoutStore.getState();
    expect(state.hiddenPanels).toContain('terminal');
    expect(state.activeTabId).toBeNull();
  });

  it('should toggle panel visibility seamlessly', () => {
    const store = useLayoutStore.getState();

    store.togglePanel('terminal');
    expect(useLayoutStore.getState().hiddenPanels).toContain('terminal');

    useLayoutStore.getState().togglePanel('terminal');
    expect(useLayoutStore.getState().hiddenPanels).not.toContain('terminal');
    expect(useLayoutStore.getState().activeTabId).toBe('terminal');
  });

  it('should handle ui:toggle-panel event from ideEventBus', () => {
    ideEventBus.emit('ui:toggle-panel', { panelId: 'terminal-panel' });
    expect(useLayoutStore.getState().hiddenPanels).toContain('terminal-panel');

    ideEventBus.emit('ui:toggle-panel', { panelId: 'terminal-panel' });
    expect(useLayoutStore.getState().hiddenPanels).not.toContain('terminal-panel');
    expect(useLayoutStore.getState().activeTabId).toBe('terminal-panel');
  });

  it('should handle ui:reset-layout event from ideEventBus', () => {
    useLayoutStore.getState().setHiddenPanels(['explorer']);
    useLayoutStore.getState().setActiveTab('explorer');

    ideEventBus.emit('ui:reset-layout');

    const state = useLayoutStore.getState();
    expect(state.layoutModel).toBeNull();
    expect(state.hiddenPanels).toEqual([]);
    expect(state.activeTabId).toBeNull();
  });

  it('should handle file:opened event from ideEventBus by opening editor tab and focusing panel', () => {
    ideEventBus.emit('file:opened', {
      filePath: '/workspace/src/Player.block',
      title: 'Player.block',
    });

    const editorState = useEditorStore.getState();
    expect(editorState.tabs.length).toBe(1);
    expect(editorState.tabs[0]?.title).toBe('Player.block');

    const layoutState = useLayoutStore.getState();
    expect(layoutState.activeTabId).toBe('/workspace/src/Player.block');
  });
});
