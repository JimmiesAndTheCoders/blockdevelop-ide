/**
 * @blockdevelop/block-engine
 * Custom Blockly integration, workspace management, and block definitions.
 */

import { IDE_METADATA } from '@blockdevelop/core';

export function initializeBlockEngine(): string {
  return `${IDE_METADATA.NAME} Block Engine Initialized`;
}
