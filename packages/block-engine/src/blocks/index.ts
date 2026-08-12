import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../types';
import { registerLogicBlocks, LOGIC_BLOCK_DEFINITIONS } from './logic';
import { registerMathBlocks, MATH_BLOCK_DEFINITIONS } from './math';
import { registerTextBlocks, TEXT_BLOCK_DEFINITIONS } from './text';
import { registerVariableBlocks, VARIABLE_BLOCK_DEFINITIONS } from './variables';
import { registerFunctionBlocks, FUNCTION_BLOCK_DEFINITIONS } from './functions';

export * from './logic';
export * from './math';
export * from './text';
export * from './variables';
export * from './functions';

export const CORE_EVENT_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'event_on_start',
    message0: 'when project starts',
    nextStatement: null,
    style: 'event_blocks',
    colour: '#06b6d4',
    tooltip: 'Runs when the project initializes',
    helpUrl: '',
  },
  {
    type: 'event_on_update',
    message0: 'every frame update',
    nextStatement: null,
    style: 'event_blocks',
    colour: '#06b6d4',
    tooltip: 'Runs on every frame update',
    helpUrl: '',
  },
];

export const CORE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  ...CORE_EVENT_BLOCK_DEFINITIONS,
  ...LOGIC_BLOCK_DEFINITIONS,
  ...MATH_BLOCK_DEFINITIONS,
  ...TEXT_BLOCK_DEFINITIONS,
  ...VARIABLE_BLOCK_DEFINITIONS,
  ...FUNCTION_BLOCK_DEFINITIONS,
];

export function registerBlockDefinitions(definitions = CORE_BLOCK_DEFINITIONS): void {
  registerLogicBlocks();
  registerMathBlocks();
  registerTextBlocks();
  registerVariableBlocks();
  registerFunctionBlocks();

  definitions.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
