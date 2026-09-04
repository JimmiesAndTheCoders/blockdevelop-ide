import type * as Blockly from 'blockly/core';
import {
  serializeWorkspaceToJsonString,
  deserializeWorkspaceFromJsonString,
} from './jsonSerialization';

export const DEFAULT_AUTO_SAVE_KEY = 'blockdevelop_workspace_autosave_v1';

/**
 * Auto-Save & Recovery Engine class for managing debounced persistent storage of workspace state.
 */
export class WorkspaceAutoSaveEngine {
  private static saveTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Saves workspace JSON state to persistent storage synchronously.
   */
  public static saveToStorage(
    workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
    storageKey = DEFAULT_AUTO_SAVE_KEY,
  ): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const jsonString = serializeWorkspaceToJsonString(workspace, false);
      window.localStorage.setItem(storageKey, jsonString);
      return true;
    } catch (err) {
      console.error('[WorkspaceAutoSaveEngine] Failed to save workspace to localStorage:', err);
      return false;
    }
  }

  /**
   * Schedules a debounced auto-save operation.
   */
  public static scheduleAutoSave(
    workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
    storageKey = DEFAULT_AUTO_SAVE_KEY,
    delayMs = 1000,
  ): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(() => {
      this.saveToStorage(workspace, storageKey);
      this.saveTimer = null;
    }, delayMs);
  }

  /**
   * Cancels any pending auto-save timeout.
   */
  public static cancelAutoSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  /**
   * Loads auto-saved workspace state from persistent storage.
   */
  public static loadFromStorage(
    workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
    storageKey = DEFAULT_AUTO_SAVE_KEY,
  ): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }

      const savedData = window.localStorage.getItem(storageKey);
      if (!savedData) {
        return false;
      }

      const success = deserializeWorkspaceFromJsonString(workspace, savedData);
      if (!success) {
        console.warn(
          '[WorkspaceAutoSaveEngine] Corrupted auto-save detected. Clearing storage key.',
        );
        this.clearStorage(storageKey);
      }
      return success;
    } catch (err) {
      console.error('[WorkspaceAutoSaveEngine] Error loading state from localStorage:', err);
      return false;
    }
  }

  /**
   * Clears auto-saved state from persistent storage.
   */
  public static clearStorage(storageKey = DEFAULT_AUTO_SAVE_KEY): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.error('[WorkspaceAutoSaveEngine] Failed to clear storage:', err);
    }
  }
}
