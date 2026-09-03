import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  ACCESS_MODIFIER_OPTIONS,
  VARIABLE_KIND_OPTIONS,
  SCOPE_LEVEL_OPTIONS,
  VARIABLE_TARGET_SCOPE_OPTIONS,
  ASSIGNMENT_OPERATOR_OPTIONS,
  UNARY_MUTATION_OPERATOR_OPTIONS,
  UNARY_MUTATION_POSITION_OPTIONS,
} from './types';

export const SCOPED_VARIABLE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Strongly-Typed Scoped Variable Declaration Block
  // Example: public static const MAX_SCORE: Int = 100
  {
    type: 'variable_declare_typed',
    message0: '%1 %2 %3 %4 : %5 = %6',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: ACCESS_MODIFIER_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: SCOPE_LEVEL_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'KIND',
        options: VARIABLE_KIND_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'myVariable',
      },
      {
        type: 'input_value',
        name: 'TYPE_ANNOTATION',
        check: 'Type',
      },
      {
        type: 'input_value',
        name: 'INITIAL_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Declares a strongly-typed variable with explicit access modifiers (public/private/protected), scope level (local/field/static/global), mutability (var/let/const/final), and initial value.',
    helpUrl: '',
  },

  // 2. Inferred / Dynamic Typed Variable Declaration Block
  // Example: public var currentSpeed = 10.5
  {
    type: 'variable_declare_inferred',
    message0: '%1 %2 %3 %4 = %5',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: ACCESS_MODIFIER_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: SCOPE_LEVEL_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'KIND',
        options: VARIABLE_KIND_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'myVariable',
      },
      {
        type: 'input_value',
        name: 'INITIAL_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Declares a variable with inferred or dynamic type from its initial value with access and scope modifiers.',
    helpUrl: '',
  },

  // 3. Simple Local Typed Declaration (for functions/loops)
  // Example: var i: Int = 0
  {
    type: 'variable_declare_local',
    message0: '%1 %2 : %3 = %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'KIND',
        options: VARIABLE_KIND_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'i',
      },
      {
        type: 'input_value',
        name: 'TYPE_ANNOTATION',
        check: 'Type',
      },
      {
        type: 'input_value',
        name: 'INITIAL_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Declares a local variable inside a function or loop body with mutability and type annotation.',
    helpUrl: '',
  },

  // 4. Scoped Variable Getter Block (reads local, this.x, super.x, static Class.x, or global.x)
  // Example: this.playerHealth
  {
    type: 'variable_get_scoped_typed',
    message0: 'get %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TARGET_SCOPE',
        options: VARIABLE_TARGET_SCOPE_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'myVariable',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Gets the value of a variable in the specified scope (local, this, super, static, global).',
    helpUrl: '',
  },

  // 5. Scoped Variable Assignment / Mutation Operator Block
  // Example: this.score += 10
  {
    type: 'variable_assign_op',
    message0: 'set %1 %2 %3 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TARGET_SCOPE',
        options: VARIABLE_TARGET_SCOPE_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'myVariable',
      },
      {
        type: 'field_dropdown',
        name: 'OPERATOR',
        options: ASSIGNMENT_OPERATOR_OPTIONS,
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Assigns or compound-mutates (=, +=, -=, *=, /=, %=) a scoped variable in local, this, super, static, or global scope.',
    helpUrl: '',
  },

  // 6. Scoped Variable Unary Increment / Decrement Block (++ / --)
  // Example: this.counter++ or ++i
  {
    type: 'variable_increment_decrement',
    message0: '%1 %2 %3 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'POSITION',
        options: UNARY_MUTATION_POSITION_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'OPERATOR',
        options: UNARY_MUTATION_OPERATOR_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'TARGET_SCOPE',
        options: VARIABLE_TARGET_SCOPE_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'i',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'variable_blocks',
    tooltip:
      'Increments (++) or decrements (--) a variable in prefix or postfix position across any scope.',
    helpUrl: '',
  },
];

/**
 * Registers all Scoped Variable Declaration and Mutation blocks into Blockly's global registry.
 */
export function registerScopedVariableBlocks(): void {
  SCOPED_VARIABLE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
