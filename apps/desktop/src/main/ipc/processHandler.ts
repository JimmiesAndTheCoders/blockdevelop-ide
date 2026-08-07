import { ipcMain, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import { IPC_CHANNELS, SpawnProcessOptions } from '@blockdevelop/core';

const activeProcesses = new Map<number, ChildProcess>();

export function registerProcessHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PROCESS_SPAWN, (event, options: SpawnProcessOptions) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    const proc = spawn(options.command, options.args || [], {
      cwd: options.cwd,
      shell: false,
    });

    if (!proc.pid) return null;

    activeProcesses.set(proc.pid, proc);

    proc.stdout?.on('data', (data) => {
      window?.webContents.send(IPC_CHANNELS.PROCESS_ON_DATA, {
        pid: proc.pid,
        type: 'stdout',
        data: data.toString(),
      });
    });

    proc.stderr?.on('data', (data) => {
      const errStr = data.toString();
      
      // Encoding-proof regex for Windows taskkill messages ("no se encontr...", "proceso...", "not found")
      const isWindowsTaskkillNoise = /no se enc|proceso|not found/i.test(errStr);

      if (!isWindowsTaskkillNoise) {
        window?.webContents.send(IPC_CHANNELS.PROCESS_ON_DATA, {
          pid: proc.pid,
          type: 'stderr',
          data: errStr,
        });
      }
    });

    proc.on('close', (code) => {
      if (proc.pid) activeProcesses.delete(proc.pid);
      if (window && !window.isDestroyed()) {
        window.webContents.send(IPC_CHANNELS.PROCESS_ON_DATA, {
          pid: proc.pid,
          type: 'exit',
          data: `Process exited with code ${code ?? 0}`,
        });
      }
    });

    return proc.pid;
  });

  ipcMain.handle(IPC_CHANNELS.PROCESS_KILL, (_, pid: number) => {
    const proc = activeProcesses.get(pid);
    if (proc && !proc.killed && proc.exitCode === null) {
      try {
        proc.kill('SIGTERM');
        activeProcesses.delete(pid);
        return true;
      } catch {
        activeProcesses.delete(pid);
        return false;
      }
    }
    activeProcesses.delete(pid);
    return false;
  });
}
