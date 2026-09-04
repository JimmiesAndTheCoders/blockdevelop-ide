import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { ADVANCED_FUNCTION_BLOCK_DEFINITIONS, registerAdvancedFunctionBlocks } from './functionBlocks';

export * from './types';
export * from './functionBlocks';

export const BASE_FUNCTION_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'procedure_defnoreturn_custom',
    message0: 'function %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'doSomething',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    style: 'procedure_blocks',
    tooltip: 'Creates a named function with no return value.',
    helpUrl: '',
  },
  {
    type: 'procedure_defreturn_custom',
    message0: 'function %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'calculateValue',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    message2: 'return %1',
    args2: [
      {
        type: 'input_value',
        name: 'RETURN',
      },
    ],
    style: 'procedure_blocks',
    tooltip: 'Creates a named function with a typed return value.',
    helpUrl: '',
  },
  {
    type: 'procedure_callnoreturn_custom',
    message0: 'call function %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'doSomething',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Calls a user-defined function that returns no value.',
    helpUrl: '',
  },
  {
    type: 'procedure_callreturn_custom',
    message0: 'call function %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'calculateValue',
      },
    ],
    output: null,
    style: 'procedure_blocks',
    tooltip: 'Calls a user-defined function and returns its result value.',
    helpUrl: '',
  },
  {
    type: 'event_listener',
    message0: 'when %1 event triggered %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'EVENT',
        options: [
          ['onStart', 'START'],
          ['onUpdate', 'UPDATE'],
          ['onKeyPress', 'KEY_PRESS'],
          ['onClick', 'CLICK'],
          ['onCustomEvent', 'CUSTOM'],
        ],
      },
      {
        type: 'field_input',
        name: 'CUSTOM_NAME',
        text: '',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    style: 'event_blocks',
    tooltip: 'Subscribes to an event signal and executes inner blocks when triggered.',
    helpUrl: '',
  },
];

export const FUNCTION_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  ...BASE_FUNCTION_BLOCK_DEFINITIONS,
  ...ADVANCED_FUNCTION_BLOCK_DEFINITIONS,
];

export function registerFunctionBlocks(): void {
  registerAdvancedFunctionBlocks();
  BASE_FUNCTION_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
