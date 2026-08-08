/**
 * @blockdevelop/core IPC Event Contracts
 * Fully typed map linking every channel to its Request & Response types.
 */

export const IPC_CHANNELS = {
  // System
  SYSTEM_GET_INFO: 'system:get-info',
  SYSTEM_GET_METRICS: 'system:get-metrics',
  SYSTEM_DEEP_LINK: 'system:deep-link',

  // File System
  FS_READ_FILE: 'fs:read-file',
  FS_WRITE_FILE: 'fs:write-file',
  FS_READ_DIR: 'fs:read-dir',
  FS_EXISTS: 'fs:exists',

  // Native Dialogs
  DIALOG_OPEN_FILE: 'dialog:open-file',
  DIALOG_SAVE_FILE: 'dialog:save-file',

  // Process Runner
  PROCESS_SPAWN: 'process:spawn',
  PROCESS_KILL: 'process:kill',
  PROCESS_ON_DATA: 'process:on-data',
} as const;

export interface SystemMetricsResult {
  cpuUsagePercent: number;
  totalMemoryMB: number;
  usedMemoryMB: number;
  freeMemoryMB: number;
  memoryUsagePercent: number;
  appMemoryMB: number;
}

export type IPCChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

export interface SystemInfoResult {
  appVersion: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  platform: string;
}

export interface FileReadOptions {
  filePath: string;
  encoding?: string;
}

export interface FileWriteOptions {
  filePath: string;
  content: string;
}

export interface DirReadResult {
  name: string;
  isDirectory: boolean;
  path: string;
}

export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
}

export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
}

export interface SpawnProcessOptions {
  command: string;
  args?: string[];
  cwd?: string;
}

/**
 * Strongly-typed IPC Contract Map
 */
export interface IPCEventMap {
  [IPC_CHANNELS.SYSTEM_GET_INFO]: {
    request: void;
    response: SystemInfoResult;
  };
  [IPC_CHANNELS.FS_READ_FILE]: {
    request: FileReadOptions;
    response: string;
  };
  [IPC_CHANNELS.FS_WRITE_FILE]: {
    request: FileWriteOptions;
    response: boolean;
  };
  [IPC_CHANNELS.FS_READ_DIR]: {
    request: string;
    response: DirReadResult[];
  };
  [IPC_CHANNELS.FS_EXISTS]: {
    request: string;
    response: boolean;
  };
  [IPC_CHANNELS.DIALOG_OPEN_FILE]: {
    request: OpenDialogOptions | undefined;
    response: string | null;
  };
  [IPC_CHANNELS.DIALOG_SAVE_FILE]: {
    request: SaveDialogOptions | undefined;
    response: string | null;
  };
  [IPC_CHANNELS.PROCESS_SPAWN]: {
    request: SpawnProcessOptions;
    response: number | null;
  };
  [IPC_CHANNELS.PROCESS_KILL]: {
    request: number;
    response: boolean;
  };
}

export type IPCRequest<K extends keyof IPCEventMap> = IPCEventMap[K]['request'];
export type IPCResponse<K extends keyof IPCEventMap> = IPCEventMap[K]['response'];

export interface IPCSerializedError {
  name: string;
  message: string;
  code: string;
  channel?: string | undefined;
  stack?: string | undefined;
}

export class IPCError extends Error {
  public readonly code: string;
  public readonly channel?: string | undefined;

  constructor(message: string, code = 'UNKNOWN_IPC_ERROR', channel?: string | undefined) {
    super(message);
    this.name = 'IPCError';
    this.code = code;
    this.channel = channel;
  }

  public toJSON(): IPCSerializedError {
    const result: IPCSerializedError = {
      name: this.name,
      message: this.message,
      code: this.code,
    };
    if (this.channel !== undefined) result.channel = this.channel;
    if (this.stack !== undefined) result.stack = this.stack;
    return result;
  }

  public static fromJSON(serialized: IPCSerializedError): IPCError {
    const err = new IPCError(serialized.message, serialized.code, serialized.channel);
    err.name = serialized.name;
    if (serialized.stack !== undefined) {
      err.stack = serialized.stack;
    }
    return err;
  }
}
