import { app, BrowserWindow, screen } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

export interface WindowBoundsState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isFullScreen: boolean;
}

const DEFAULT_STATE: WindowBoundsState = {
  width: 1280,
  height: 800,
  isMaximized: false,
  isFullScreen: false,
};

function getStateFilePath(): string {
  return path.join(app.getPath('userData'), 'window-state.json');
}

/**
 * Validates that saved (x, y) coordinates lie within the bounds of at least one connected display.
 */
function isPositionVisible(x: number, y: number, width: number, height: number): boolean {
  const displays = screen.getAllDisplays();
  return displays.some((display) => {
    const { x: dx, y: dy, width: dw, height: dh } = display.bounds;
    return x >= dx && y >= dy && x + width <= dx + dw && y + height <= dy + dh;
  });
}

/**
 * Loads saved window state from disk with display boundary validation.
 */
export function loadWindowState(): WindowBoundsState {
  try {
    const filePath = getStateFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<WindowBoundsState>;

      const state: WindowBoundsState = {
        width: typeof parsed.width === 'number' && parsed.width >= 400 ? parsed.width : DEFAULT_STATE.width,
        height: typeof parsed.height === 'number' && parsed.height >= 300 ? parsed.height : DEFAULT_STATE.height,
        isMaximized: Boolean(parsed.isMaximized),
        isFullScreen: Boolean(parsed.isFullScreen),
      };

      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        if (isPositionVisible(parsed.x, parsed.y, state.width, state.height)) {
          state.x = parsed.x;
          state.y = parsed.y;
        }
      }

      return state;
    }
  } catch (err) {
    console.warn('[WindowState] Failed to load saved window state, using defaults:', err);
  }

  return { ...DEFAULT_STATE };
}

/**
 * Saves current window bounds and state to disk.
 */
export function saveWindowState(window: BrowserWindow): void {
  if (window.isDestroyed()) return;

  try {
    const isMaximized = window.isMaximized();
    const isFullScreen = window.isFullScreen();
    const bounds = window.getNormalBounds();

    const state: WindowBoundsState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized,
      isFullScreen,
    };

    fs.writeFileSync(getStateFilePath(), JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[WindowState] Failed to save window state:', err);
  }
}

/**
 * Attaches event listeners to auto-save window state on resize, move, maximize, and close events.
 */
export function manageWindowState(window: BrowserWindow, initialState: WindowBoundsState): void {
  // Restore maximized / fullscreen state after window is initialized
  if (initialState.isMaximized) {
    window.maximize();
  } else if (initialState.isFullScreen) {
    window.setFullScreen(true);
  }

  let saveTimeout: NodeJS.Timeout | null = null;

  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveWindowState(window);
    }, 300);
  };

  window.on('resize', debouncedSave);
  window.on('move', debouncedSave);
  window.on('maximize', debouncedSave);
  window.on('unmaximize', debouncedSave);
  window.on('close', () => {
    saveWindowState(window);
  });
}
