import { app, ipcMain } from 'electron';
import os from 'node:os';
import { IPC_CHANNELS, SystemInfoResult, SystemMetricsResult } from '@blockdevelop/core';
import { wrapIPCHandler } from './errorHandling';

let previousCpuTimes = os.cpus().map((c) => c.times);

function calculateCpuUsagePercent(): number {
  const currentCpuTimes = os.cpus().map((c) => c.times);
  let totalIdleDiff = 0;
  let totalTickDiff = 0;

  for (let i = 0; i < currentCpuTimes.length; i++) {
    const prev = previousCpuTimes[i];
    const curr = currentCpuTimes[i];

    if (!prev || !curr) continue;

    const idleDiff = curr.idle - prev.idle;
    const totalDiff =
      curr.user +
      curr.nice +
      curr.sys +
      curr.idle +
      curr.irq -
      (prev.user + prev.nice + prev.sys + prev.idle + prev.irq);

    totalIdleDiff += idleDiff;
    totalTickDiff += totalDiff;
  }

  previousCpuTimes = currentCpuTimes;

  if (totalTickDiff === 0) return 0;
  const idlePercent = totalIdleDiff / totalTickDiff;
  return Math.max(0, Math.min(100, Math.round((1 - idlePercent) * 100)));
}

export function registerSystemHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.SYSTEM_GET_INFO,
    wrapIPCHandler(IPC_CHANNELS.SYSTEM_GET_INFO, (): SystemInfoResult => {
      return {
        appVersion: app.getVersion(),
        electronVersion: process.versions.electron || 'unknown',
        chromeVersion: process.versions.chrome || 'unknown',
        nodeVersion: process.versions.node || 'unknown',
        platform: process.platform,
      };
    }),
  );

  ipcMain.handle(
    IPC_CHANNELS.SYSTEM_GET_METRICS,
    wrapIPCHandler(IPC_CHANNELS.SYSTEM_GET_METRICS, (): SystemMetricsResult => {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const appMem = process.memoryUsage().rss;

      const totalMB = Math.round(totalMem / (1024 * 1024));
      const usedMB = Math.round(usedMem / (1024 * 1024));
      const freeMB = Math.round(freeMem / (1024 * 1024));
      const appMB = Math.round(appMem / (1024 * 1024));
      const memPercent = Math.round((usedMem / totalMem) * 100);

      return {
        cpuUsagePercent: calculateCpuUsagePercent(),
        totalMemoryMB: totalMB,
        usedMemoryMB: usedMB,
        freeMemoryMB: freeMB,
        memoryUsagePercent: memPercent,
        appMemoryMB: appMB,
      };
    }),
  );
}
