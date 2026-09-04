import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type LogStream = 'stdout' | 'stderr' | 'system';

export interface TerminalLogEntry {
  id: string;
  timestamp: number;
  text: string;
  stream: LogStream;
}

export interface TerminalState {
  logs: TerminalLogEntry[];
  activePids: number[];
  isTerminalOpen: boolean;
  maxLogLimit: number;

  // Actions
  appendLog: (text: string, stream?: LogStream) => void;
  clearLogs: () => void;
  addPid: (pid: number) => void;
  removePid: (pid: number) => void;
  setTerminalOpen: (open: boolean) => void;
}

export const useTerminalStore = create<TerminalState>()(
  immer((set) => ({
    logs: [],
    activePids: [],
    isTerminalOpen: true,
    maxLogLimit: 1000,

    appendLog: (text, stream = 'stdout') =>
      set((state) => {
        const newEntry: TerminalLogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: Date.now(),
          text,
          stream,
        };

        state.logs.push(newEntry);

        // Keep log history bounded for performance
        if (state.logs.length > state.maxLogLimit) {
          state.logs.shift();
        }
      }),

    clearLogs: () =>
      set((state) => {
        state.logs = [];
      }),

    addPid: (pid) =>
      set((state) => {
        if (!state.activePids.includes(pid)) {
          state.activePids.push(pid);
        }
      }),

    removePid: (pid) =>
      set((state) => {
        state.activePids = state.activePids.filter((p) => p !== pid);
      }),

    setTerminalOpen: (open) =>
      set((state) => {
        state.isTerminalOpen = open;
      }),
  })),
);
