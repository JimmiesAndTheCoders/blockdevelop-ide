import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  IPCError,
  IPCSerializedError,
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

async function invokeWithParsedError<T>(channel: string, ...args: unknown[]): Promise<T> {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (err: unknown) {
    const rawMessage = (err as Error)?.message || '';
    // Extract JSON payload from Electron's 'Error invoking remote method... Error: {JSON}' string
    const jsonMatch = rawMessage.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as IPCSerializedError;
        throw IPCError.fromJSON(parsed);
      } catch (parseErr) {
        if (parseErr instanceof IPCError) throw parseErr;
      }
    }
    throw new IPCError(rawMessage || 'An unknown remote IPC error occurred.', 'REMOTE_IPC_ERROR', channel);
  }
}

const api: BlockDevelopAPI = {
  system: {
    getSystemInfo: () => invokeWithParsedError(IPC_CHANNELS.SYSTEM_GET_INFO),
  },
  fs: {
    readFile: (options) => invokeWithParsedError(IPC_CHANNELS.FS_READ_FILE, options),
    writeFile: (options) => invokeWithParsedError(IPC_CHANNELS.FS_WRITE_FILE, options),
    readDir: (dirPath) => invokeWithParsedError(IPC_CHANNELS.FS_READ_DIR, dirPath),
    exists: (filePath) => invokeWithParsedError(IPC_CHANNELS.FS_EXISTS, filePath),
  },
  dialog: {
    openFile: (options) => invokeWithParsedError(IPC_CHANNELS.DIALOG_OPEN_FILE, options),
    saveFile: (options) => invokeWithParsedError(IPC_CHANNELS.DIALOG_SAVE_FILE, options),
  },
  process: {
    spawn: (options) => invokeWithParsedError(IPC_CHANNELS.PROCESS_SPAWN, options),
    kill: (pid) => invokeWithParsedError(IPC_CHANNELS.PROCESS_KILL, pid),
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
