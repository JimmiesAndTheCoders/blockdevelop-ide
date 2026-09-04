import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { CLASS_ACCESS_OPTIONS, CLASS_MODIFIER_OPTIONS } from './types';

export const CLASS_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Class Enclosing Definition Wrapper
  // Example: public class Player extends Entity implements IDamageable { ... }
  {
    type: 'class_wrapper',
    message0: '%1 %2 class %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'MODIFIER',
        options: CLASS_MODIFIER_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'CLASS_NAME',
        text: 'MyClass',
      },
    ],
    message1: 'extends %1 implements %2',
    args1: [
      {
        type: 'field_input',
        name: 'EXTENDS_CLASS',
        text: '',
      },
      {
        type: 'field_input',
        name: 'IMPLEMENTS_INTERFACES',
        text: '',
      },
    ],
    message2: 'fields & properties %1',
    args2: [
      {
        type: 'input_statement',
        name: 'FIELDS',
      },
    ],
    message3: 'constructor %1',
    args3: [
      {
        type: 'input_statement',
        name: 'CONSTRUCTOR',
      },
    ],
    message4: 'methods & functions %1',
    args4: [
      {
        type: 'input_statement',
        name: 'METHODS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'event_blocks',
    tooltip:
      'Enclosing Class Definition wrapper separating Fields, Constructor, and Methods with inheritance and interfaces.',
    helpUrl: '',
  },

  // 2. Class Constructor Block: public function new(...) { ... }
  {
    type: 'class_constructor',
    message0: 'constructor new ( %1 )',
    args0: [
      {
        type: 'input_statement',
        name: 'PARAMS',
      },
    ],
    message1: 'body %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Class constructor method (new) executed when an instance is created.',
    helpUrl: '',
  },
];

/**
 * Registers all Class & Scope wrapper blocks into Blockly's global registry.
 */
export function registerClassBlocks(): void {
  CLASS_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
