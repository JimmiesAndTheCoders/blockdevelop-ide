import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type UITheme = 'dark' | 'light' | 'high-contrast';

export interface UIState {
  theme: UITheme;
  isCommandPaletteOpen: boolean;
  statusMessage: string;
  isSidebarOpen: boolean;

  // Actions
  setTheme: (theme: UITheme) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setStatusMessage: (msg: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    theme: 'dark',
    isCommandPaletteOpen: false,
    statusMessage: 'Ready',
    isSidebarOpen: true,

    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),

    toggleCommandPalette: () =>
      set((state) => {
        state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
      }),

    setCommandPaletteOpen: (open) =>
      set((state) => {
        state.isCommandPaletteOpen = open;
      }),

    setStatusMessage: (msg) =>
      set((state) => {
        state.statusMessage = msg;
      }),

    toggleSidebar: () =>
      set((state) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      }),
  }))
);
