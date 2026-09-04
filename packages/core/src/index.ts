/**
 * @blockdevelop/core
 * Shared type definitions, constants, stores, and events for BlockDevelop IDE.
 */

export * from './ipc';
export * from './store';
export * from './events';

export interface IDEProjectConfig {
  id: string;
  name: string;
  version: string;
  targetPlatform: string;
  entryPoint: string;
}

export const IDE_METADATA = {
  NAME: 'BlockDevelop IDE',
  VERSION: '0.6.1-rc1',
} as const;
