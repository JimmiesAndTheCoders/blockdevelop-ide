import { app, ipcMain } from 'electron';
import { IPC_CHANNELS, SystemInfoResult } from '@blockdevelop/core';

export function registerSystemHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_INFO, (): SystemInfoResult => {
    return {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      platform: process.platform,
    };
  });
}
