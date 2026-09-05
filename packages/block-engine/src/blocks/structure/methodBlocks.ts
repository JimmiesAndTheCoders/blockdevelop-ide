import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  CLASS_ACCESS_OPTIONS,
  METHOD_MODIFIER_OPTIONS,
} from './types';

export const METHOD_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Strongly-Typed Class Member Method Declaration Block:
  // public override function calculateScore(param0: Int): Float { ... }
  {
    type: 'class_method_declaration',
    message0: '%1 %2 function %3 ( %4 ) : %5',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'MODIFIER',
        options: METHOD_MODIFIER_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'METHOD_NAME',
        text: 'myMethod',
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
      'Declares a class member method with access modifiers (public/private/protected), specifiers (override/static/inline/abstract), parameters, return type, and body.',
    helpUrl: '',
  },

  // 2. Advanced Method Parameter Item with Optional Modifier (?param):
  // ?multiplier: Float = 1.0
  {
    type: 'method_param_item',
    message0: '%1 param %2 : %3 default %4',
    args0: [
      {
        type: 'field_checkbox',
        name: 'IS_OPTIONAL',
        checked: false,
      },
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
    tooltip: 'Defines a method parameter with optional toggle (?param), type annotation, and default value.',
    helpUrl: '',
  },
];

export interface MethodValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates abstract method body constraints.
 */
export function validateMethodBody(block: Blockly.Block): MethodValidationResult {
  const modField = block.getField('MODIFIER') as Blockly.FieldDropdown | null;
  const isAbstract = modField?.getValue() === 'ABSTRACT';
  const bodyInput = block.getInput('BODY');
  const hasBody = Boolean(
    bodyInput?.connection?.targetBlock() ||
      bodyInput?.connection?.targetConnection ||
      bodyInput?.connection?.isConnected(),
  );

  if (isAbstract && hasBody) {
    const errorMsg = 'Abstract methods cannot have an implementation body.';
    block.setWarningText(errorMsg);
    (block as unknown as { warningText_?: string }).warningText_ = errorMsg;
    return { valid: false, error: errorMsg };
  }

  block.setWarningText(null);
  (block as unknown as { warningText_?: string | null }).warningText_ = null;
  return { valid: true };
}

/**
 * Attaches real-time field validators and abstract method constraints.
 */
function attachMethodBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    // Validate Method Name
    const methodNameField = this.getField('METHOD_NAME');
    if (methodNameField) {
      methodNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid method identifier '${trimmed}'. Must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Parameter Name
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

    // Attach listener for abstract method body checks
    if (this.workspace && blockType === 'class_method_declaration') {
      this.workspace.addChangeListener(() => {
        if (!this.isDeadOrDying?.()) {
          validateMethodBody(this);
        }
      });
    }
  };
}

/**
 * Registers all Member Method blocks into Blockly's global registry.
 */
export function registerMethodBlocks(): void {
  METHOD_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachMethodBlockValidators(def.type);
  });
}
