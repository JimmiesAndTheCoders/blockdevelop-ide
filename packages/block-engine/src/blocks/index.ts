import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../types';

export const CORE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
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

export function registerBlockDefinitions(definitions = CORE_BLOCK_DEFINITIONS): void {
  definitions.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
