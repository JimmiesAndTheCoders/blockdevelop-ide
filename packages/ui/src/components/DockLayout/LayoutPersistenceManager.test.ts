import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  LayoutPersistenceManager,
  LAYOUT_STORAGE_KEY,
} from './LayoutPersistenceManager';
import { DEFAULT_WORKSPACE_LAYOUT_JSON } from './defaultLayout';

describe('LayoutPersistenceManager Suite', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    vi.useFakeTimers();
    store = {};

    const localStorageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: () => null,
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default layout fallback when localStorage is empty', () => {
    const layout = LayoutPersistenceManager.loadSavedLayout();
    expect(layout.layout).toBeDefined();
    expect(layout).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
  });

  it('should debounce saving layout JSON to localStorage', () => {
    const sampleLayout = { global: {}, layout: { type: 'row', children: [] } };

    LayoutPersistenceManager.saveLayout(sampleLayout, 300);
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBeNull();

    vi.advanceTimersByTime(300);

    const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(sampleLayout);
  });

  it('should write layout JSON immediately when using saveLayoutSync', () => {
    const sampleLayout = { global: {}, layout: { type: 'row', children: [] } };

    LayoutPersistenceManager.saveLayoutSync(sampleLayout);

    const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(sampleLayout);
  });

  it('should handle corrupted layout JSON gracefully and auto-recover to default layout', () => {
    // Inject invalid JSON string into localStorage
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, '{{corrupted_json_syntax');

    const layout = LayoutPersistenceManager.loadSavedLayout();

    // Auto-recovery should fallback to default layout and clear corrupted entry
    expect(layout).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBeNull();
  });

  it('should clear saved layout from localStorage', () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ key: 'val' }));
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).not.toBeNull();

    LayoutPersistenceManager.clearSavedLayout();
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBeNull();
  });
});
