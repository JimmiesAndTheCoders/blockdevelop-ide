import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ideEventBus } from '../events/eventBus';
import { useEditorStore } from './editorStore';

/**
 * Serialized layout node structure compatible with FlexLayout models.
 */
export interface SerializedLayoutNode {
  type?: 'row' | 'tabset' | 'tab' | string;
  id?: string;
  name?: string;
  component?: string;
  icon?: string;
  weight?: number;
  selected?: number;
  enableClose?: boolean;
  children?: SerializedLayoutNode[];
  [key: string]: unknown;
}

/**
 * Serialized layout JSON structure compatible with FlexLayout IJsonModel.
 */
export interface SerializedLayoutModel {
  global?: unknown;
  borders?: unknown[];
  layout: SerializedLayoutNode | Record<string, unknown>;
}

export interface LayoutState {
  layoutModel: SerializedLayoutModel | null;
  activeTabId: string | null;
  hiddenPanels: string[];

  // Actions
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  togglePanel: (panelId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  resetLayout: (defaultLayoutJson?: SerializedLayoutModel | unknown) => void;
  saveLayout: () => SerializedLayoutModel | null;
  loadLayout: (json: SerializedLayoutModel | unknown) => void;
  setHiddenPanels: (panels: string[]) => void;
  setLayoutModel: (model: SerializedLayoutModel | null | unknown) => void;
}

export const useLayoutStore: UseBoundStore<StoreApi<LayoutState>> = create<LayoutState>()(
  immer((set, get) => ({
    layoutModel: null,
    activeTabId: null,
    hiddenPanels: [],

    openPanel: (panelId) =>
      set((state) => {
        state.hiddenPanels = state.hiddenPanels.filter((id) => id !== panelId);
        state.activeTabId = panelId;
      }),

    closePanel: (panelId) =>
      set((state) => {
        if (!state.hiddenPanels.includes(panelId)) {
          state.hiddenPanels.push(panelId);
        }
        if (state.activeTabId === panelId) {
          state.activeTabId = null;
        }
      }),

    togglePanel: (panelId) => {
      const isHidden = get().hiddenPanels.includes(panelId);
      if (isHidden) {
        get().openPanel(panelId);
      } else {
        get().closePanel(panelId);
      }
    },

    setActiveTab: (tabId) =>
      set((state) => {
        state.activeTabId = tabId;
      }),

    resetLayout: (defaultLayoutJson) =>
      set((state) => {
        try {
          state.layoutModel = defaultLayoutJson
            ? (JSON.parse(JSON.stringify(defaultLayoutJson)) as SerializedLayoutModel)
            : null;
        } catch (err) {
          console.error('[LayoutStore] Reset layout failed, auto-recovering:', err);
          state.layoutModel = null;
        }
        state.hiddenPanels = [];
        state.activeTabId = null;
      }),

    saveLayout: () => {
      const model = get().layoutModel;
      return model ? (JSON.parse(JSON.stringify(model)) as SerializedLayoutModel) : null;
    },

    loadLayout: (json) =>
      set((state) => {
        try {
          if (!json || typeof json !== 'object') {
            throw new Error('Invalid layout JSON structure');
          }
          state.layoutModel = JSON.parse(JSON.stringify(json)) as SerializedLayoutModel;
          state.hiddenPanels = [];
        } catch (err) {
          console.error(
            '[LayoutStore] Failed to load layout JSON, auto-recovering to default state:',
            err
          );
          state.layoutModel = null;
          state.hiddenPanels = [];
        }
      }),

    setHiddenPanels: (panels) =>
      set((state) => {
        state.hiddenPanels = [...panels];
      }),

    setLayoutModel: (model) =>
      set((state) => {
        try {
          state.layoutModel = model
            ? (JSON.parse(JSON.stringify(model)) as SerializedLayoutModel)
            : null;
        } catch (err) {
          console.error('[LayoutStore] setLayoutModel failed, auto-recovering:', err);
          state.layoutModel = null;
        }
      }),
  }))
);

/**
 * Attaches global ideEventBus listeners to layout store & editor store actions.
 * Returns an unsubscribe cleanup function.
 */
export function setupLayoutEventListeners(): () => void {
  const handleTogglePanel = ({ panelId }: { panelId: string }) => {
    useLayoutStore.getState().togglePanel(panelId);
  };

  const handleResetLayout = () => {
    useLayoutStore.getState().resetLayout();
  };

  const handleFileOpened = ({
    filePath,
    fileId,
    title,
  }: {
    filePath: string;
    fileId?: string;
    title?: string;
  }) => {
    const tabId = fileId || filePath;
    const tabTitle = title || filePath.split(/[/\\]/).pop() || 'Untitled';

    // Register tab in editor store
    useEditorStore.getState().openTab({
      id: tabId,
      title: tabTitle,
      filePath,
      isDirty: false,
    });

    // Unhide and focus tab/panel in layout store
    useLayoutStore.getState().openPanel(tabId);
  };

  ideEventBus.on('ui:toggle-panel', handleTogglePanel);
  ideEventBus.on('ui:reset-layout', handleResetLayout);
  ideEventBus.on('file:opened', handleFileOpened);

  return () => {
    ideEventBus.off('ui:toggle-panel', handleTogglePanel);
    ideEventBus.off('ui:reset-layout', handleResetLayout);
    ideEventBus.off('file:opened', handleFileOpened);
  };
}
