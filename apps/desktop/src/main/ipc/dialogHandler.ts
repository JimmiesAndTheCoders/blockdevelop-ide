import {
  ipcMain,
  dialog,
  BrowserWindow,
  OpenDialogOptions as ElectronOpenDialogOptions,
  SaveDialogOptions as ElectronSaveDialogOptions,
} from 'electron';
import { IPC_CHANNELS, OpenDialogOptions, SaveDialogOptions } from '@blockdevelop/core';
import { assertObject } from './validation';
import { wrapIPCHandler } from './errorHandling';

export function registerDialogHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.DIALOG_OPEN_FILE,
    wrapIPCHandler(IPC_CHANNELS.DIALOG_OPEN_FILE, async (event, options?: OpenDialogOptions) => {
      if (options !== undefined) {
        assertObject(options, 'OpenDialogOptions');
      }

      const parentWindow = BrowserWindow.fromWebContents(event.sender);

      const dialogOptions: ElectronOpenDialogOptions = {
        title: options?.title || 'Open File',
        properties: ['openFile'],
      };

      if (options?.defaultPath) dialogOptions.defaultPath = options.defaultPath;
      if (options?.filters) dialogOptions.filters = options.filters;

      // Associate dialog directly with parent window as a modal sheet
      const result =
        parentWindow && !parentWindow.isDestroyed()
          ? await dialog.showOpenDialog(parentWindow, dialogOptions)
          : await dialog.showOpenDialog(dialogOptions);

      return result.canceled ? null : (result.filePaths[0] ?? null);
    })
  );

  ipcMain.handle(
    IPC_CHANNELS.DIALOG_SAVE_FILE,
    wrapIPCHandler(IPC_CHANNELS.DIALOG_SAVE_FILE, async (event, options?: SaveDialogOptions) => {
      if (options !== undefined) {
        assertObject(options, 'SaveDialogOptions');
      }

      const parentWindow = BrowserWindow.fromWebContents(event.sender);

      const dialogOptions: ElectronSaveDialogOptions = {
        title: options?.title || 'Save File',
      };

      if (options?.defaultPath) dialogOptions.defaultPath = options.defaultPath;
      if (options?.filters) dialogOptions.filters = options.filters;

      // Associate dialog directly with parent window as a modal sheet
      const result =
        parentWindow && !parentWindow.isDestroyed()
          ? await dialog.showSaveDialog(parentWindow, dialogOptions)
          : await dialog.showSaveDialog(dialogOptions);

      return result.canceled ? null : (result.filePath ?? null);
    })
  );
}
