import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { enforceSecurityPolicies, setupWebviewSecurityGuardrails } from './security';
import { registerAllIPCHandlers } from './ipc';
import { registerPrivilegedSchemes, setupCustomProtocolHandler } from './protocol';
import { loadWindowState, manageWindowState } from './windowState';
import { setupCrashHandlers } from './crashHandler';

// Re-create __dirname for ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enforce Single Instance Lock across OS
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  console.log('[SingleInstance] Another instance is already running. Quitting duplicate instance.');
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

// Setup global crash handlers
setupCrashHandlers(() => mainWindow);

// Register privileged schemes before ready
registerPrivilegedSchemes();

function createMainWindow(): void {
  const windowState = loadWindowState();

  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: windowState.width,
    height: windowState.height,
    minWidth: 900,
    minHeight: 600,
    title: 'BlockDevelop IDE',
    backgroundColor: '#1e1e1e',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  };

  // Only assign x and y if defined to satisfy exactOptionalPropertyTypes
  if (windowState.x !== undefined && windowState.y !== undefined) {
    windowOptions.x = windowState.x;
    windowOptions.y = windowState.y;
  }

  mainWindow = new BrowserWindow(windowOptions);

  manageWindowState(mainWindow, windowState);
  enforceSecurityPolicies(mainWindow);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupWebviewSecurityGuardrails();
  registerAllIPCHandlers();
  createMainWindow();
  setupCustomProtocolHandler(() => mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
