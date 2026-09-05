import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  CLASS_ACCESS_OPTIONS,
  PROPERTY_SPECIFIER_OPTIONS,
  PROPERTY_ACCESS_MODE_OPTIONS,
} from './types';

export const PROPERTY_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Advanced Class Property Declaration Block:
  // public static var health(default, null): Int = 100;
  {
    type: 'class_property_declaration',
    message0: '%1 %2 var %3 %4 : %5 = %6',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'SPECIFIER',
        options: PROPERTY_SPECIFIER_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'PROP_NAME',
        text: 'myProperty',
      },
      {
        type: 'field_dropdown',
        name: 'ACCESS_MODE',
        options: PROPERTY_ACCESS_MODE_OPTIONS,
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
    style: 'structure_blocks',
    tooltip:
      'Declares a class property with access modifiers (public/private), specifiers (static/inline/final), accessor mode ((default, null), (get, set)), type, and initial value.',
    helpUrl: '',
  },

  // 2. Dedicated Property Getter Method Definition:
  // function get_health(): Int { return this._health; }
  {
    type: 'property_getter_def',
    message0: 'getter for %1 () : %2',
    args0: [
      {
        type: 'field_input',
        name: 'PROP_NAME',
        text: 'myProperty',
      },
      {
        type: 'input_value',
        name: 'RETURN_TYPE',
        check: 'Type',
      },
    ],
    message1: 'get %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Defines a custom getter method for a property (function get_propertyName(): Type).',
    helpUrl: '',
  },

  // 3. Dedicated Property Setter Method Definition:
  // function set_health(val: Int): Int { this._health = val; return val; }
  {
    type: 'property_setter_def',
    message0: 'setter for %1 ( %2 : %3 )',
    args0: [
      {
        type: 'field_input',
        name: 'PROP_NAME',
        text: 'myProperty',
      },
      {
        type: 'field_input',
        name: 'PARAM_NAME',
        text: 'value',
      },
      {
        type: 'input_value',
        name: 'PARAM_TYPE',
        check: 'Type',
      },
    ],
    message1: 'set %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'procedure_blocks',
    tooltip: 'Defines a custom setter method for a property (function set_propertyName(value: Type): Type).',
    helpUrl: '',
  },
];

/**
 * Attaches real-time field validators and warning indicators to property blocks.
 */
function attachPropertyBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    const propNameField = this.getField('PROP_NAME');
    if (propNameField) {
      propNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid property identifier '${trimmed}'. Must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    const paramNameField = this.getField('PARAM_NAME');
    if (paramNameField) {
      paramNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid parameter identifier '${trimmed}'.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }
  };
}

/**
 * Registers all Scoped Property blocks into Blockly's global registry.
 */
export function registerPropertyBlocks(): void {
  PROPERTY_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachPropertyBlockValidators(def.type);
  });
}
