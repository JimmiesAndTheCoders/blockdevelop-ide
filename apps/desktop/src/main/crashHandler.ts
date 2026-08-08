import { app, dialog, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

function getLogFilePath(): string {
  const logDir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return path.join(logDir, 'crash-report.log');
}

function writeCrashLog(title: string, error: unknown): void {
  try {
    const filePath = getLogFilePath();
    const timestamp = new Date().toISOString();
    const errObj = error as { name?: string; message?: string; stack?: string };

    const logEntry = `
================================================
CRASH REPORT [${timestamp}]
Type: ${title}
OS: ${process.platform} (${process.arch})
App Version: ${app.getVersion()}
Electron: ${process.versions.electron || 'unknown'}
Node: ${process.versions.node || 'unknown'}
Error: ${errObj.name || 'Error'}: ${errObj.message || String(error)}
Stack Trace:
${errObj.stack || 'No stack trace available.'}
================================================
\n`;

    fs.appendFileSync(filePath, logEntry, 'utf8');
    console.error(`[CrashHandler] ${title}:`, errObj.message || error);
  } catch (logErr) {
    console.error('[CrashHandler] Failed to write crash report to disk:', logErr);
  }
}

/**
 * Initializes global crash handlers for Main process, renderer processes, and child processes.
 */
export function setupCrashHandlers(mainWindowGetter: () => BrowserWindow | null): void {
  // Main process uncaught exceptions
  process.on('uncaughtException', (error) => {
    writeCrashLog('Uncaught Exception', error);
    dialog.showErrorBox(
      'BlockDevelop IDE System Error',
      `An unexpected system error occurred:\n\n${error.message || String(error)}\n\nA crash log has been saved to the logs directory.`
    );
  });

  // Main process unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    writeCrashLog('Unhandled Rejection', reason);
  });

  // Renderer process crash detection and auto-recovery prompt
  app.on('render-process-gone', (_event, webContents, details) => {
    writeCrashLog('Render Process Gone', new Error(`Reason: ${details.reason}, Exit Code: ${details.exitCode}`));

    const window = mainWindowGetter();
    if (window && !window.isDestroyed() && webContents === window.webContents) {
      dialog
        .showMessageBox(window, {
          type: 'error',
          title: 'IDE Workspace Crashed',
          message: 'The workspace renderer process unexpectedly crashed.',
          detail: `Reason: ${details.reason}. Would you like to reload the workspace?`,
          buttons: ['Reload Workspace', 'Close IDE'],
          defaultId: 0,
        })
        .then(({ response }) => {
          if (response === 0) {
            window.reload();
          } else {
            app.quit();
          }
        });
    }
  });

  // Child process crash detection
  app.on('child-process-gone', (_event, details) => {
    writeCrashLog('Child Process Gone', new Error(`Type: ${details.type}, Reason: ${details.reason}`));
  });
}
