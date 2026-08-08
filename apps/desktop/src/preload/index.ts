import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  IPCError,
  IPCSerializedError,
  SystemInfoResult,
  SystemMetricsResult,
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

export interface ParsedDeepLinkEvent {
  action: 'open-project' | 'open-file' | 'import-plugin';
  params: Record<string, string>;
}

export interface BlockDevelopAPI {
  system: {
    getSystemInfo: () => Promise<SystemInfoResult>;
    getSystemMetrics: () => Promise<SystemMetricsResult>;
    onDeepLink: (callback: (event: ParsedDeepLinkEvent) => void) => () => void;
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

// Rate limiter state
const MAX_IPC_CALLS_PER_SEC = 100;
let callCount = 0;
let lastResetWindow = Date.now();

function checkIPCRateLimit(channel: string): void {
  const now = Date.now();
  if (now - lastResetWindow > 1000) {
    callCount = 0;
    lastResetWindow = now;
  }
  callCount++;
  if (callCount > MAX_IPC_CALLS_PER_SEC) {
    throw new IPCError(
      `IPC Rate limit exceeded (${MAX_IPC_CALLS_PER_SEC}/sec) on channel '${channel}'`,
      'IPC_RATE_LIMIT_EXCEEDED',
      channel
    );
  }
}

// Timeout invocation wrapper
const DEFAULT_IPC_TIMEOUT_MS = 15000;

async function invokeWithParsedError<T>(
  channel: string,
  timeoutMs = DEFAULT_IPC_TIMEOUT_MS,
  ...args: unknown[]
): Promise<T> {
  checkIPCRateLimit(channel);

  let timer: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new IPCError(
          `IPC Request timed out after ${timeoutMs}ms on channel '${channel}'`,
          'IPC_TIMEOUT',
          channel
        )
      );
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([
      ipcRenderer.invoke(channel, ...args) as Promise<T>,
      timeoutPromise,
    ]);
    clearTimeout(timer!);
    return result;
  } catch (err: unknown) {
    clearTimeout(timer!);

    if (err instanceof IPCError) throw err;

    const rawMessage = (err as Error)?.message || '';
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

/**
 * Recursively freezes an object structure to protect against prototype pollution or property overrides.
 */
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((prop) => {
    const val = (obj as Record<string, unknown>)[prop];
    if (val !== null && (typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val)) {
      deepFreeze(val as object);
    }
  });
  return Object.freeze(obj);
}

const rawAPI: BlockDevelopAPI = {
  system: {
    getSystemInfo: () => invokeWithParsedError(IPC_CHANNELS.SYSTEM_GET_INFO),
    getSystemMetrics: () => invokeWithParsedError(IPC_CHANNELS.SYSTEM_GET_METRICS),
    onDeepLink: (callback) => {
      const handler = (_: unknown, data: ParsedDeepLinkEvent) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.SYSTEM_DEEP_LINK, handler);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.SYSTEM_DEEP_LINK, handler);
      };
    },
  },
  fs: {
    readFile: (options) => invokeWithParsedError(IPC_CHANNELS.FS_READ_FILE, 15000, options),
    writeFile: (options) => invokeWithParsedError(IPC_CHANNELS.FS_WRITE_FILE, 15000, options),
    readDir: (dirPath) => invokeWithParsedError(IPC_CHANNELS.FS_READ_DIR, 15000, dirPath),
    exists: (filePath) => invokeWithParsedError(IPC_CHANNELS.FS_EXISTS, 15000, filePath),
  },
  dialog: {
    openFile: (options) => invokeWithParsedError(IPC_CHANNELS.DIALOG_OPEN_FILE, 30000, options),
    saveFile: (options) => invokeWithParsedError(IPC_CHANNELS.DIALOG_SAVE_FILE, 30000, options),
  },
  process: {
    spawn: (options) => invokeWithParsedError(IPC_CHANNELS.PROCESS_SPAWN, 15000, options),
    kill: (pid) => invokeWithParsedError(IPC_CHANNELS.PROCESS_KILL, 5000, pid),
    onData: (callback) => {
      const handler = (_: unknown, data: ProcessOutputEvent) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.PROCESS_ON_DATA, handler);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.PROCESS_ON_DATA, handler);
      };
    },
  },
};

// Deep freeze API bridge before exposing to window
const frozenAPI = deepFreeze(rawAPI);

contextBridge.exposeInMainWorld('blockDevelopAPI', frozenAPI);
