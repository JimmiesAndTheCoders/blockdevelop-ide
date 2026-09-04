import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { PRIMITIVE_TYPE_OPTIONS } from './types';

export const TYPE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Primitive & Core Type Specifier Block
  {
    type: 'type_primitive',
    message0: 'type %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: PRIMITIVE_TYPE_OPTIONS,
      },
    ],
    output: 'Type',
    style: 'logic_blocks',
    tooltip: 'Specifies a primitive or core data type (Int, Float, String, Bool, Dynamic, Void).',
    helpUrl: '',
  },

  // 2. Generic / Parameterized Array<T> Type Specifier Block
  {
    type: 'type_array_of',
    message0: 'Array<%1>',
    args0: [
      {
        type: 'input_value',
        name: 'ELEMENT_TYPE',
        check: 'Type',
      },
    ],
    output: 'Type',
    inputsInline: true,
    style: 'logic_blocks',
    tooltip: 'Specifies a typed Array<T> data structure containing elements of the given type.',
    helpUrl: '',
  },

  // 3. Generic / Parameterized Map<K, V> Type Specifier Block
  {
    type: 'type_map_of',
    message0: 'Map<%1, %2>',
    args0: [
      {
        type: 'input_value',
        name: 'KEY_TYPE',
        check: 'Type',
      },
      {
        type: 'input_value',
        name: 'VALUE_TYPE',
        check: 'Type',
      },
    ],
    output: 'Type',
    inputsInline: true,
    style: 'logic_blocks',
    tooltip:
      'Specifies a key-value dictionary Map<K, V> where K is the key type and V is the value type.',
    helpUrl: '',
  },

  // 4. Custom User-Defined Class / Interface Type Specifier Block
  {
    type: 'type_custom',
    message0: 'type %1',
    args0: [
      {
        type: 'field_input',
        name: 'TYPE_NAME',
        text: 'CustomClass',
      },
    ],
    output: 'Type',
    style: 'logic_blocks',
    tooltip: 'Specifies a custom user-defined Class, Interface, or Enum type by name.',
    helpUrl: '',
  },

  // 5. Nullable / Optional Type Modifier Toggle Block (?Type / Null<T>)
  {
    type: 'type_nullable',
    message0: 'nullable %1',
    args0: [
      {
        type: 'input_value',
        name: 'INNER_TYPE',
        check: 'Type',
      },
    ],
    output: 'Type',
    inputsInline: true,
    style: 'logic_blocks',
    tooltip: 'Marks the enclosed type as Nullable / Optional (?Type or Null<T>).',
    helpUrl: '',
  },
];

/**
 * Registers all Type Annotation & Type Specifier blocks into Blockly's global block registry.
 */
export function registerTypeBlocks(): void {
  TYPE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
