import { ipcMain } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  IPC_CHANNELS,
  FileReadOptions,
  FileWriteOptions,
  DirReadResult,
} from '@blockdevelop/core';
import { assertObject, assertString, sanitizePath } from './validation';
import { wrapIPCHandler } from './errorHandling';

export function registerFSHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.FS_READ_FILE,
    wrapIPCHandler(IPC_CHANNELS.FS_READ_FILE, async (_, options: FileReadOptions) => {
      assertObject(options, 'FileReadOptions');
      const safePath = sanitizePath(options.filePath, 'filePath');
      const encoding = options.encoding ? assertString(options.encoding, 'encoding') : 'utf-8';

      return await fs.readFile(safePath, { encoding: encoding as BufferEncoding });
    })
  );

  ipcMain.handle(
    IPC_CHANNELS.FS_WRITE_FILE,
    wrapIPCHandler(IPC_CHANNELS.FS_WRITE_FILE, async (_, options: FileWriteOptions) => {
      assertObject(options, 'FileWriteOptions');
      const safePath = sanitizePath(options.filePath, 'filePath');
      const content = assertString(options.content, 'content');

      await fs.mkdir(path.dirname(safePath), { recursive: true });
      await fs.writeFile(safePath, content, 'utf-8');
      return true;
    })
  );

  ipcMain.handle(
    IPC_CHANNELS.FS_READ_DIR,
    wrapIPCHandler(IPC_CHANNELS.FS_READ_DIR, async (_, dirPath: string): Promise<DirReadResult[]> => {
      const safeDir = sanitizePath(dirPath, 'dirPath');
      const entries = await fs.readdir(safeDir, { withFileTypes: true });

      return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: path.join(safeDir, entry.name),
      }));
    })
  );

  ipcMain.handle(
    IPC_CHANNELS.FS_EXISTS,
    wrapIPCHandler(IPC_CHANNELS.FS_EXISTS, async (_, filePath: string) => {
      try {
        const safePath = sanitizePath(filePath, 'filePath');
        await fs.access(safePath);
        return true;
      } catch {
        return false;
      }
    })
  );
}
