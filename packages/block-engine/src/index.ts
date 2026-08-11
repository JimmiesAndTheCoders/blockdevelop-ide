/**
 * @blockdevelop/block-engine
 * Custom Blockly integration, workspace management, themes, and block definitions.
 */

export * from './types';
export * from './theme';
export * from './blocks';
export * from './toolbox';
export * from './contextmenu';
export * from './serialization';
export * from './components';

import { IDE_METADATA } from '@blockdevelop/core';

export function initializeBlockEngine(): string {
  return `${IDE_METADATA.NAME} Block Engine Initialized`;
}
