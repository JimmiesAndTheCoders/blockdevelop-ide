import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../types';

export const TEXT_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'text_literal',
    message0: '“%1”',
    args0: [
      {
        type: 'field_input',
        name: 'TEXT',
        text: '',
      },
    ],
    output: 'String',
    style: 'text_blocks',
    tooltip: 'A string text literal.',
    helpUrl: '',
  },
  {
    type: 'text_join_custom',
    message0: 'join text %1 %2',
    args0: [
      {
        type: 'input_value',
        name: 'ADD0',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'ADD1',
        check: 'String',
      },
    ],
    output: 'String',
    inputsInline: true,
    style: 'text_blocks',
    tooltip: 'Concatenates two strings together.',
    helpUrl: '',
  },
  {
    type: 'text_length_custom',
    message0: 'length of %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['String', 'Array'],
      },
    ],
    output: 'Number',
    style: 'text_blocks',
    tooltip: 'Returns the number of characters in the specified string.',
    helpUrl: '',
  },
  {
    type: 'text_isEmpty_custom',
    message0: '%1 is empty',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['String', 'Array'],
      },
    ],
    output: 'Boolean',
    style: 'text_blocks',
    tooltip: 'Returns true if the specified text string is empty.',
    helpUrl: '',
  },
  {
    type: 'text_print_custom',
    message0: 'print popup %1',
    args0: [
      {
        type: 'input_value',
        name: 'TEXT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'text_blocks',
    tooltip: 'Prints the specified text or message in a UI dialog popup.',
    helpUrl: '',
  },
  {
    type: 'text_log_custom',
    message0: 'console log [%1] %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'LEVEL',
        options: [
          ['INFO', 'INFO'],
          ['WARN', 'WARN'],
          ['ERROR', 'ERROR'],
        ],
      },
      {
        type: 'input_value',
        name: 'TEXT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'text_blocks',
    tooltip: 'Outputs message text directly to the IDE Terminal / Console window.',
    helpUrl: '',
  },
];

/**
 * Registers all custom Text & String manipulation blocks into Blockly's global block registry.
 */
export function registerTextBlocks(): void {
  TEXT_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
