import {
  ipcMain,
  dialog,
  OpenDialogOptions as ElectronOpenDialogOptions,
  SaveDialogOptions as ElectronSaveDialogOptions,
} from 'electron';
import { IPC_CHANNELS, OpenDialogOptions, SaveDialogOptions } from '@blockdevelop/core';

export function registerDialogHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FILE, async (_, options?: OpenDialogOptions) => {
    const dialogOptions: ElectronOpenDialogOptions = {
      title: options?.title || 'Open File',
      properties: ['openFile'],
    };

    if (options?.defaultPath) dialogOptions.defaultPath = options.defaultPath;
    if (options?.filters) dialogOptions.filters = options.filters;

    const result = await dialog.showOpenDialog(dialogOptions);
    return result.canceled ? null : (result.filePaths[0] ?? null);
  });

  ipcMain.handle(IPC_CHANNELS.DIALOG_SAVE_FILE, async (_, options?: SaveDialogOptions) => {
    const dialogOptions: ElectronSaveDialogOptions = {
      title: options?.title || 'Save File',
    };

    if (options?.defaultPath) dialogOptions.defaultPath = options.defaultPath;
    if (options?.filters) dialogOptions.filters = options.filters;

    const result = await dialog.showSaveDialog(dialogOptions);
    return result.canceled ? null : (result.filePath ?? null);
  });
}
