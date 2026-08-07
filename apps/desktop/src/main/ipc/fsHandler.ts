import { ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import {
  IPC_CHANNELS,
  FileReadOptions,
  FileWriteOptions,
  DirReadResult,
} from '@blockdevelop/core';

export function registerFSHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.FS_READ_FILE, async (_, options: FileReadOptions) => {
    return await fs.readFile(options.filePath, { encoding: (options.encoding as BufferEncoding) || 'utf-8' });
  });

  ipcMain.handle(IPC_CHANNELS.FS_WRITE_FILE, async (_, options: FileWriteOptions) => {
    await fs.mkdir(path.dirname(options.filePath), { recursive: true });
    await fs.writeFile(options.filePath, options.content, 'utf-8');
    return true;
  });

  ipcMain.handle(IPC_CHANNELS.FS_READ_DIR, async (_, dirPath: string): Promise<DirReadResult[]> => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      path: path.join(dirPath, entry.name),
    }));
  });

  ipcMain.handle(IPC_CHANNELS.FS_EXISTS, async (_, filePath: string) => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  });
}
