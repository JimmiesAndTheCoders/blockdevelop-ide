import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  SystemInfoResult,
  FileReadOptions,
  FileWriteOptions,
  DirReadResult,
  OpenDialogOptions,
  SaveDialogOptions,
  SpawnProcessOptions,
} from '@blockdevelop/core';

export interface ProcessOutputEvent {
  pid: number;
  type: 'stdout' | 'stderr' | 'exit';
  data: string;
}

export interface BlockDevelopAPI {
  system: {
    getSystemInfo: () => Promise<SystemInfoResult>;
  };
  fs: {
    readFile: (options: FileReadOptions) => Promise<string>;
    writeFile: (options: FileWriteOptions) => Promise<boolean>;
    readDir: (dirPath: string) => Promise<DirReadResult[]>;
    exists: (filePath: string) => Promise<boolean>;
  };
  dialog: {
    openFile: (options?: OpenDialogOptions) => Promise<string | null>;
    saveFile: (options?: SaveDialogOptions) => Promise<string | null>;
  };
  process: {
    spawn: (options: SpawnProcessOptions) => Promise<number | null>;
    kill: (pid: number) => Promise<boolean>;
    onData: (callback: (event: ProcessOutputEvent) => void) => () => void;
  };
}

const api: BlockDevelopAPI = {
  system: {
    getSystemInfo: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO),
  },
  fs: {
    readFile: (options) => ipcRenderer.invoke(IPC_CHANNELS.FS_READ_FILE, options),
    writeFile: (options) => ipcRenderer.invoke(IPC_CHANNELS.FS_WRITE_FILE, options),
    readDir: (dirPath) => ipcRenderer.invoke(IPC_CHANNELS.FS_READ_DIR, dirPath),
    exists: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.FS_EXISTS, filePath),
  },
  dialog: {
    openFile: (options) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FILE, options),
    saveFile: (options) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SAVE_FILE, options),
  },
  process: {
    spawn: (options) => ipcRenderer.invoke(IPC_CHANNELS.PROCESS_SPAWN, options),
    kill: (pid) => ipcRenderer.invoke(IPC_CHANNELS.PROCESS_KILL, pid),
    onData: (callback) => {
      const handler = (_: unknown, data: ProcessOutputEvent) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.PROCESS_ON_DATA, handler);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.PROCESS_ON_DATA, handler);
      };
    },
  },
};

contextBridge.exposeInMainWorld('blockDevelopAPI', api);
