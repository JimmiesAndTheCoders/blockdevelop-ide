/**
 * @blockdevelop/block-engine
 * Custom Blockly integration, workspace management, themes, and block definitions.
 */

import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';

// Globally register English locale for all Blockly block messages
Blockly.setLocale(En as unknown as Record<string, string>);

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
