import { ipcMain, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'node:child_process';
import { IPC_CHANNELS, SpawnProcessOptions } from '@blockdevelop/core';
import {
  assertObject,
  assertNonEmptyString,
  assertArrayOfStrings,
  assertPositiveInteger,
  sanitizePath,
  sanitizeCLIArguments,
} from './validation';
import { wrapIPCHandler } from './errorHandling';

const activeProcesses = new Map<number, ChildProcess>();

export function registerProcessHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.PROCESS_SPAWN,
    wrapIPCHandler(IPC_CHANNELS.PROCESS_SPAWN, (event, options: SpawnProcessOptions) => {
      assertObject(options, 'SpawnProcessOptions');
      const command = assertNonEmptyString(options.command, 'command');
      const rawArgs = options.args ? assertArrayOfStrings(options.args, 'args') : [];
      const safeArgs = sanitizeCLIArguments(rawArgs);
      const cwd = options.cwd ? sanitizePath(options.cwd, 'cwd') : undefined;

      const window = BrowserWindow.fromWebContents(event.sender);

      const proc = spawn(command, safeArgs, {
        cwd,
        shell: false,
        windowsHide: true,
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
    })
  );

  ipcMain.handle(
    IPC_CHANNELS.PROCESS_KILL,
    wrapIPCHandler(IPC_CHANNELS.PROCESS_KILL, (_, pid: number) => {
      const safePid = assertPositiveInteger(pid, 'pid');
      const proc = activeProcesses.get(safePid);

      if (proc && !proc.killed && proc.exitCode === null) {
        try {
          proc.kill('SIGTERM');
          activeProcesses.delete(safePid);
          return true;
        } catch {
          activeProcesses.delete(safePid);
          return false;
        }
      }
      activeProcesses.delete(safePid);
      return false;
    })
  );
}
