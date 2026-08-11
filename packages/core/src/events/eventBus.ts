import mitt, { Emitter } from 'mitt';
import { TargetPlatform } from '../store/projectStore';

/**
 * Global IDE Event Definitions
 */
export type IDEEventTypes = {
  // Project Events
  'project:opened': { path: string; name: string };
  'project:closed': void;
  'project:target-changed': { target: TargetPlatform };

  // File Events
  'file:opened': { filePath: string; fileId?: string; title?: string };

  // Block & Workspace Events
  'block:selected': { blockId: string; blockType: string };
  'block:changed': { fileId: string; blockCount: number };
  'code:generated': { fileId: string; code: string; language: string };

  // Compiler & Build Events
  'build:start': { target: TargetPlatform };
  'build:log': { text: string; stream: 'stdout' | 'stderr' };
  'build:complete': { success: boolean; durationMs: number };

  // UI & Layout Panel Events
  'ui:notify': { message: string; type: 'info' | 'warning' | 'error' };
  'ui:toggle-palette': void;
  'ui:toggle-panel': { panelId: string };
  'ui:reset-layout': void;
};

export type IDEEventBus = Emitter<IDEEventTypes>;

/**
 * Singleton Event Bus Instance
 */
export const ideEventBus: IDEEventBus = mitt<IDEEventTypes>();
