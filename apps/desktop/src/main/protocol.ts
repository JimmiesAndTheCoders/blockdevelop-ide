import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';
import { IPC_CHANNELS } from '@blockdevelop/core';

export interface ParsedDeepLink {
  action: 'open-project' | 'open-file' | 'import-plugin';
  params: Record<string, string>;
}

/**
 * Register custom protocol scheme as privileged before app ready.
 */
export function registerPrivilegedSchemes(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'blockdevelop',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: false,
      },
    },
  ]);
}

/**
 * Parse and strictly sanitize custom deep link URLs.
 * Rejects dangerous shell metacharacters and invalid actions.
 */
export function parseAndSanitizeDeepLink(rawUrl: string): ParsedDeepLink | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'blockdevelop:') {
      console.warn(`[DeepLink Security] Rejected non-matching protocol: ${parsed.protocol}`);
      return null;
    }

    // Deep link action is the hostname (e.g. blockdevelop://open-project?path=...)
    const action = parsed.hostname.toLowerCase();
    const validActions = ['open-project', 'open-file', 'import-plugin'] as const;

    if (!validActions.includes(action as typeof validActions[number])) {
      console.warn(`[DeepLink Security] Rejected invalid deep link action: ${action}`);
      return null;
    }

    const params: Record<string, string> = {};
    let isDangerous = false;

    // Clean unescaped regex pattern inside character set []
    const dangerousPattern = /[&;|`$\n\r]/g;

    parsed.searchParams.forEach((value, key) => {
      // Reset lastIndex for global regex testing
      dangerousPattern.lastIndex = 0;
      const isValueDangerous = dangerousPattern.test(value);
      dangerousPattern.lastIndex = 0;
      const isKeyDangerous = dangerousPattern.test(key);

      if (isValueDangerous || isKeyDangerous) {
        console.warn(`[DeepLink Security] Rejected dangerous characters in param: ${key}=${value}`);
        isDangerous = true;
        return;
      }
      params[key] = value.trim();
    });

    if (isDangerous) return null;

    return {
      action: action as ParsedDeepLink['action'],
      params,
    };
  } catch (err) {
    console.error(`[DeepLink Security] Failed to parse deep link URL: ${rawUrl}`, err);
    return null;
  }
}

/**
 * Register OS default protocol client and handle deep link events across Windows, macOS, and Linux.
 */
export function setupCustomProtocolHandler(mainWindowGetter: () => BrowserWindow | null): void {
  // Register blockdevelop:// with OS
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('blockdevelop', process.execPath, [
        path.resolve(process.argv[1]!),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient('blockdevelop');
  }

  // macOS deep link listener
  app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLinkUrl(url, mainWindowGetter());
  });

  // Windows/Linux single-instance deep link listener
  app.on('second-instance', (_, commandLine) => {
    const window = mainWindowGetter();
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
    const deepLinkUrl = commandLine.find((arg) => arg.startsWith('blockdevelop://'));
    if (deepLinkUrl) {
      handleDeepLinkUrl(deepLinkUrl, window);
    }
  });
}

function handleDeepLinkUrl(url: string, window: BrowserWindow | null): void {
  const result = parseAndSanitizeDeepLink(url);
  if (!result) return;

  console.log(`[DeepLink] Dispatching sanitized deep link action '${result.action}':`, result.params);

  if (window && !window.isDestroyed()) {
    window.webContents.send(IPC_CHANNELS.SYSTEM_DEEP_LINK, result);
  }
}
