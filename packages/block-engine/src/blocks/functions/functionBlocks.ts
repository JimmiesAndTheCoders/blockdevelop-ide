import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { FUNCTION_ACCESS_OPTIONS, FUNCTION_MODIFIER_OPTIONS } from './types';

export const ADVANCED_FUNCTION_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Typed Function Parameter Item Block
  {
    type: 'function_param_item',
    message0: 'param %1 : %2 default %3',
    args0: [
      {
        type: 'field_input',
        name: 'PARAM_NAME',
        text: 'arg',
      },
      {
        type: 'input_value',
        name: 'PARAM_TYPE',
        check: 'Type',
      },
      {
        type: 'input_value',
        name: 'DEFAULT_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Defines a named parameter with explicit type and optional default value.',
    helpUrl: '',
  },

  // 2. Strongly-Typed Function & Method Definition Block
  {
    type: 'function_def_typed',
    message0: '%1 %2 function %3 ( %4 ) : %5',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: FUNCTION_ACCESS_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'MODIFIER',
        options: FUNCTION_MODIFIER_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'calculateValue',
      },
      {
        type: 'input_statement',
        name: 'PARAMS',
      },
      {
        type: 'input_value',
        name: 'RETURN_TYPE',
        check: 'Type',
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
    tooltip:
      'Defines a strongly-typed function or method with access modifiers (public/private), specifiers (static/override/inline), typed parameters, and return type.',
    helpUrl: '',
  },

  // 3. Typed Function with Return Value (Simple Top-level Form)
  {
    type: 'function_def_simple',
    message0: 'function %1 ( %2 ) : %3',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'doCalculation',
      },
      {
        type: 'input_statement',
        name: 'PARAMS',
      },
      {
        type: 'input_value',
        name: 'RETURN_TYPE',
        check: 'Type',
      },
    ],
    message1: 'do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Creates a local or top-level function with typed parameters and return type.',
    helpUrl: '',
  },

  // 4. Return Value Statement Block: return <value>;
  {
    type: 'return_value',
    message0: 'return %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Returns a value from the enclosing function.',
    helpUrl: '',
  },

  // 5. Bare Return Statement Block: return;
  {
    type: 'return_bare',
    message0: 'return',
    previousStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Exits early from a void function with no return value (return;).',
    helpUrl: '',
  },

  // 6. Typed Function Call Expression (Returns Value)
  // Example: calculateScore(arg0, arg1)
  {
    type: 'function_call_typed',
    message0: 'call %1 ( %2 %3 )',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'myFunction',
      },
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Invokes a function and evaluates to its return value.',
    helpUrl: '',
  },

  // 7. Typed Function Call Statement (Void / Action)
  // Example: doAction(arg0, arg1);
  {
    type: 'function_call_typed_statement',
    message0: 'call %1 ( %2 %3 )',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'myFunction',
      },
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Invokes a void function or executes a function call statement.',
    helpUrl: '',
  },

  // 8. Instance Method Call Expression: target.method(arg0, arg1)
  // Example: player.takeDamage(10)
  {
    type: 'method_call_instance',
    message0: 'on %1 call .%2 ( %3 %4 )',
    args0: [
      {
        type: 'input_value',
        name: 'TARGET',
      },
      {
        type: 'field_input',
        name: 'METHOD',
        text: 'doAction',
      },
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Calls an instance method on a target object and returns its result.',
    helpUrl: '',
  },

  // 9. Instance Method Call Statement: target.method(arg0, arg1);
  {
    type: 'method_call_instance_statement',
    message0: 'on %1 call .%2 ( %3 %4 )',
    args0: [
      {
        type: 'input_value',
        name: 'TARGET',
      },
      {
        type: 'field_input',
        name: 'METHOD',
        text: 'doAction',
      },
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Executes an instance method call statement on a target object.',
    helpUrl: '',
  },

  // 10. Static Method Call: ClassName.method(arg0, arg1)
  // Example: MathUtil.clamp(val, min, max)
  {
    type: 'method_call_static',
    message0: 'call %1 .%2 ( %3 %4 )',
    args0: [
      {
        type: 'field_input',
        name: 'CLASS_NAME',
        text: 'MathUtil',
      },
      {
        type: 'field_input',
        name: 'METHOD',
        text: 'calculate',
      },
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'procedure_blocks',
    tooltip: 'Invokes a static method on a Class (e.g. Math.max or SoundManager.play).',
    helpUrl: '',
  },
];

/**
 * Registers all Advanced Function Definition & Return blocks into Blockly's global registry.
 */
export function registerAdvancedFunctionBlocks(): void {
  ADVANCED_FUNCTION_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
