import { BrowserWindow, shell } from 'electron';

export function enforceSecurityPolicies(window: BrowserWindow): void {
  // Prevent opening untrusted remote URLs directly in Electron
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Block unexpected in-app navigation
  window.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== window.webContents.getURL()) {
      event.preventDefault();
    }
  });
}
