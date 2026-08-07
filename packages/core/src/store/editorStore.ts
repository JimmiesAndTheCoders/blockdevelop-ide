import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface EditorTab {
  id: string;
  title: string;
  filePath: string;
  isDirty: boolean;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  zoomLevel: number;

  // Actions
  openTab: (tab: EditorTab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  markTabDirty: (tabId: string, dirty: boolean) => void;
  setZoomLevel: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    tabs: [],
    activeTabId: null,
    zoomLevel: 1.0,

    openTab: (newTab) =>
      set((state) => {
        const existing = state.tabs.find((t) => t.id === newTab.id);
        if (!existing) {
          state.tabs.push(newTab);
        }
        state.activeTabId = newTab.id;
      }),

    closeTab: (tabId) =>
      set((state) => {
        state.tabs = state.tabs.filter((t) => t.id !== tabId);
        if (state.activeTabId === tabId) {
          const lastTab = state.tabs[state.tabs.length - 1];
          state.activeTabId = lastTab ? lastTab.id : null;
        }
      }),

    setActiveTab: (tabId) =>
      set((state) => {
        state.activeTabId = tabId;
      }),

    markTabDirty: (tabId, dirty) =>
      set((state) => {
        const tab = state.tabs.find((t) => t.id === tabId);
        if (tab) tab.isDirty = dirty;
      }),

    setZoomLevel: (zoom) =>
      set((state) => {
        state.zoomLevel = zoom;
      }),
  }))
);
