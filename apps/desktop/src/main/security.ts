import { BrowserWindow, shell, session } from 'electron';

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

  // Enforce Content-Security-Policy dynamic response headers on default session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';" +
          " script-src 'self' 'unsafe-inline';" +
          " style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
          " font-src 'self' https://fonts.gstatic.com data:;" +
          " img-src 'self' data: blob:;" +
          " connect-src 'self' ws: http: https:;" +
          " object-src 'none';" +
          " base-uri 'self';" +
          " form-action 'self';",
        ],
      },
    });
  });

  // Intercept and deny unauthorized permission requests (camera, mic, geolocation, notifications, etc.)
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    const allowedPermissions: string[] = []; // No hardware permissions required by default

    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      console.warn(
        `[Security Guardrail] Denied permission request for '${permission}' from origin '${details.requestingUrl}'`
      );
      callback(false);
    }
  });

  // Intercept synchronous permission checks
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    const allowedPermissions: string[] = [];
    return allowedPermissions.includes(permission);
  });
}
