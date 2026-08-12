import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../types';

export const MATH_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'math_number',
    message0: '%1',
    args0: [
      {
        type: 'field_number',
        name: 'NUM',
        value: 0,
      },
    ],
    output: 'Number',
    style: 'math_blocks',
    tooltip: 'A number literal value.',
    helpUrl: '',
  },
  {
    type: 'math_arithmetic',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number',
      },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['+', 'ADD'],
          ['-', 'MINUS'],
          ['\u00D7', 'MULTIPLY'],
          ['\u00F7', 'DIVIDE'],
          ['^', 'POWER'],
          ['%', 'MODULO'],
        ],
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns the result of performing the arithmetic operation on two numbers.',
    helpUrl: '',
  },
  {
    type: 'math_single',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['square root', 'ROOT'],
          ['absolute', 'ABS'],
          ['-', 'NEG'],
          ['ln', 'LN'],
          ['log10', 'LOG10'],
          ['e^', 'EXP'],
          ['10^', 'POW10'],
          ['sin', 'SIN'],
          ['cos', 'COS'],
          ['tan', 'TAN'],
        ],
      },
      {
        type: 'input_value',
        name: 'NUM',
        check: 'Number',
      },
    ],
    output: 'Number',
    style: 'math_blocks',
    tooltip: 'Returns the result of applying the mathematical function to the input number.',
    helpUrl: '',
  },
  {
    type: 'math_round',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['round', 'ROUND'],
          ['round up (ceil)', 'ROUNDUP'],
          ['round down (floor)', 'ROUNDDOWN'],
        ],
      },
      {
        type: 'input_value',
        name: 'NUM',
        check: 'Number',
      },
    ],
    output: 'Number',
    style: 'math_blocks',
    tooltip: 'Rounds input number up, down, or to nearest integer.',
    helpUrl: '',
  },
  {
    type: 'math_modulo',
    message0: 'remainder of %1 \u00F7 %2',
    args0: [
      {
        type: 'input_value',
        name: 'DIVIDEND',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'DIVISOR',
        check: 'Number',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns the remainder from dividing the two numbers.',
    helpUrl: '',
  },
  {
    type: 'math_random_int',
    message0: 'random integer from %1 to %2',
    args0: [
      {
        type: 'input_value',
        name: 'FROM',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'TO',
        check: 'Number',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns a random integer between the two specified limits, inclusive.',
    helpUrl: '',
  },
  {
    type: 'math_constrain',
    message0: 'constrain %1 low %2 high %3',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'LOW',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'HIGH',
        check: 'Number',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Constrains a number to be between the specified lower and upper limits.',
    helpUrl: '',
  },
];

/**
 * Registers all custom Data & Mathematics blocks into Blockly's global block registry.
 */
export function registerMathBlocks(): void {
  MATH_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
