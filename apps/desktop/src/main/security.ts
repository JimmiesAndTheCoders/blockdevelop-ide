import { app, BrowserWindow, shell, session } from 'electron';

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
            " img-src 'self' data: blob: https:;" +
            " media-src 'self' data: blob: https:;" +
            " connect-src 'self' ws: http: https:;" +
            " object-src 'none';" +
            " base-uri 'self';" +
            " form-action 'self';",
        ],
      },
    });
  });

  // Intercept and deny unauthorized permission requests (camera, mic, geolocation, notifications, etc.)
  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback, details) => {
      const allowedPermissions: string[] = []; // No hardware permissions required by default

      if (allowedPermissions.includes(permission)) {
        callback(true);
      } else {
        console.warn(
          `[Security Guardrail] Denied permission request for '${permission}' from origin '${details.requestingUrl}'`,
        );
        callback(false);
      }
    },
  );

  // Intercept synchronous permission checks
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    const allowedPermissions: string[] = [];
    return allowedPermissions.includes(permission);
  });
}

/**
 * Enforce strict sandbox, webPreferences, and popup restrictions on all dynamically created webviews and frames.
 */
export function setupWebviewSecurityGuardrails(): void {
  app.on('web-contents-created', (_, contents) => {
    // Intercept when a <webview> tag is attached in the renderer
    contents.on('will-attach-webview', (_event, webPreferences, _params) => {
      // Strip dangerous capabilities
      delete webPreferences.preload;
      webPreferences.nodeIntegration = false;
      webPreferences.nodeIntegrationInSubFrames = false;
      webPreferences.webSecurity = true;
      webPreferences.contextIsolation = true;
      webPreferences.sandbox = true;
      webPreferences.allowRunningInsecureContent = false;
    });

    // Enforce window open handlers on child frames / preview webviews
    contents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:') || url.startsWith('http:')) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });
  });
}
