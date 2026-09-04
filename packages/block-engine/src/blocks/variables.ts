import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../types';

export const VARIABLE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'variables_get_custom',
    message0: '%1',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'item',
      },
    ],
    output: null,
    style: 'variable_blocks',
    tooltip: 'Returns the value of this variable.',
    helpUrl: '',
  },
  {
    type: 'variables_set_custom',
    message0: 'set %1 to %2',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'item',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'variable_blocks',
    tooltip: 'Sets this variable to equal the input value.',
    helpUrl: '',
  },
  {
    type: 'variables_declare_scoped',
    message0: 'declare %1 variable %2 as %3 = %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: [
          ['local', 'LOCAL'],
          ['global', 'GLOBAL'],
          ['class field', 'FIELD'],
        ],
      },
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'myVar',
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['Any', 'ANY'],
          ['Number', 'NUMBER'],
          ['String', 'STRING'],
          ['Boolean', 'BOOLEAN'],
          ['Array', 'ARRAY'],
        ],
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'variable_blocks',
    tooltip:
      'Declares a variable with explicit scope (local, global, class field) and type annotations.',
    helpUrl: '',
  },
  {
    type: 'variables_get_scoped',
    message0: 'get %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: [
          ['local', 'LOCAL'],
          ['global', 'GLOBAL'],
          ['field', 'FIELD'],
        ],
      },
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'myVar',
      },
    ],
    output: null,
    style: 'variable_blocks',
    tooltip: 'Reads the value of a scoped variable (local, global, or class field).',
    helpUrl: '',
  },
  {
    type: 'variables_set_scoped',
    message0: 'set %1 %2 to %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: [
          ['local', 'LOCAL'],
          ['global', 'GLOBAL'],
          ['field', 'FIELD'],
        ],
      },
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'myVar',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'variable_blocks',
    tooltip: 'Updates the value of a scoped variable (local, global, or class field).',
    helpUrl: '',
  },
];

/**
 * Registers all custom Variables & Memory Management blocks into Blockly's global block registry.
 */
export function registerVariableBlocks(): void {
  VARIABLE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
