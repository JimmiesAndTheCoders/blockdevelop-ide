import * as Blockly from 'blockly/core';
import * as BlocklyBlocks from 'blockly/blocks';
import type { CustomBlockDefinition } from '../types';

/**
 * Initializes standard Blockly built-in block definitions.
 */
export function initializeStandardLogicBlocks(): void {
  if (BlocklyBlocks && typeof BlocklyBlocks === 'object') {
    // blockly/blocks exports built-in logic & loop definitions
  }
}

export const LOGIC_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'logic_if_else',
    message0: 'if %1 then',
    args0: [
      {
        type: 'input_value',
        name: 'IF0',
        check: 'Boolean',
      },
    ],
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO0',
      },
    ],
    message2: 'else %1',
    args2: [
      {
        type: 'input_statement',
        name: 'ELSE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'logic_blocks',
    tooltip: 'If condition is true, execute statement block, otherwise execute else block.',
    helpUrl: '',
  },
  {
    type: 'logic_compare',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'A',
      },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE'],
        ],
      },
      {
        type: 'input_value',
        name: 'B',
      },
    ],
    output: 'Boolean',
    inputsInline: true,
    style: 'logic_blocks',
    tooltip: 'Returns true if both inputs satisfy the comparison operator.',
    helpUrl: '',
  },
  {
    type: 'logic_operation',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Boolean',
      },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['and', 'AND'],
          ['or', 'OR'],
        ],
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Boolean',
      },
    ],
    output: 'Boolean',
    inputsInline: true,
    style: 'logic_blocks',
    tooltip: 'Returns true if both inputs are true (and) or if at least one input is true (or).',
    helpUrl: '',
  },
  {
    type: 'logic_negate',
    message0: 'not %1',
    args0: [
      {
        type: 'input_value',
        name: 'BOOL',
        check: 'Boolean',
      },
    ],
    output: 'Boolean',
    style: 'logic_blocks',
    tooltip: 'Returns true if input is false, and false if input is true.',
    helpUrl: '',
  },
  {
    type: 'logic_boolean',
    message0: '%1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'BOOL',
        options: [
          ['true', 'TRUE'],
          ['false', 'FALSE'],
        ],
      },
    ],
    output: 'Boolean',
    style: 'logic_blocks',
    tooltip: 'Returns either true or false.',
    helpUrl: '',
  },
  {
    type: 'controls_repeat_ext',
    message0: 'repeat %1 times',
    args0: [
      {
        type: 'input_value',
        name: 'TIMES',
        check: 'Number',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    tooltip: 'Executes inner statements specified number of times.',
    helpUrl: '',
  },
  {
    type: 'controls_while',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'MODE',
        options: [
          ['while', 'WHILE'],
          ['until', 'UNTIL'],
        ],
      },
      {
        type: 'input_value',
        name: 'BOOL',
        check: 'Boolean',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    tooltip: 'Repeats inner statements while or until condition evaluates to true.',
    helpUrl: '',
  },
  {
    type: 'controls_for',
    message0: 'count with %1 from %2 to %3 by %4',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'i',
      },
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
      {
        type: 'input_value',
        name: 'BY',
        check: 'Number',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    tooltip: 'Counts from start number to end number by step, executing statements on each step.',
    helpUrl: '',
  },
  {
    type: 'controls_flow_statements',
    message0: '%1 loop',
    args0: [
      {
        type: 'field_dropdown',
        name: 'FLOW',
        options: [
          ['break out of', 'BREAK'],
          ['continue with next iteration of', 'CONTINUE'],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    tooltip: 'Breaks out of current enclosing loop or continues to next iteration.',
    helpUrl: '',
  },
];

/**
 * Registers all custom Logic & Control blocks into Blockly's global block registry.
 */
export function registerLogicBlocks(): void {
  initializeStandardLogicBlocks();

  LOGIC_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
