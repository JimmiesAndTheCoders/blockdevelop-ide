import type { SerializedLayoutModel } from '@blockdevelop/core';
import { LayoutSanitizer } from './layoutSanitizer';
import { LayoutModelFactory } from './defaultLayout';

export const LAYOUT_STORAGE_KEY = 'blockdevelop_ide_workspace_layout_v1';

/**
 * Handles debounced persistence, sanitized loading, and auto-recovery fallback for IDE workspace layout models.
 */
export class LayoutPersistenceManager {
  private static saveTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Persists workspace layout JSON to storage with debouncing (default 500ms delay).
   */
  public static saveLayout(
    layoutJson: SerializedLayoutModel | unknown,
    delayMs = 500,
    storageKey = LAYOUT_STORAGE_KEY,
  ): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      try {
        if (!layoutJson) return;
        const serialized = JSON.stringify(layoutJson);
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(storageKey, serialized);
        }
      } catch (err) {
        console.error('[LayoutPersistenceManager] Failed to persist workspace layout:', err);
      }
    }, delayMs);
  }

  /**
   * Immediately persists layout model JSON without debounce delay.
   */
  public static saveLayoutSync(
    layoutJson: SerializedLayoutModel | unknown,
    storageKey = LAYOUT_STORAGE_KEY,
  ): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    try {
      if (!layoutJson) return;
      const serialized = JSON.stringify(layoutJson);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, serialized);
      }
    } catch (err) {
      console.error(
        '[LayoutPersistenceManager] Failed to persist workspace layout synchronously:',
        err,
      );
    }
  }

  /**
   * Loads saved layout model JSON from storage with automatic sanitization and recovery fallback.
   */
  public static loadSavedLayout(storageKey = LAYOUT_STORAGE_KEY): SerializedLayoutModel {
    const fallback = LayoutModelFactory.createDefaultJson() as unknown as SerializedLayoutModel;

    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback;
      }

      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw);
      // Sanitize loaded layout model against known component definitions
      const sanitized = LayoutSanitizer.sanitize(parsed);
      return sanitized as unknown as SerializedLayoutModel;
    } catch (err) {
      console.warn(
        '[LayoutPersistenceManager] Corrupted or invalid saved layout detected. Reverting to default workspace layout:',
        err,
      );
      this.clearSavedLayout(storageKey);
      return fallback;
    }
  }

  /**
   * Clears saved layout state from storage.
   */
  public static clearSavedLayout(storageKey = LAYOUT_STORAGE_KEY): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.error('[LayoutPersistenceManager] Failed to clear saved layout:', err);
    }
  }
}
