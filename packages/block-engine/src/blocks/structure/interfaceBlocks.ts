import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  CLASS_ACCESS_OPTIONS,
  PROPERTY_ACCESSOR_READ_OPTIONS,
  PROPERTY_ACCESSOR_WRITE_OPTIONS,
  VALID_INTERFACE_MEMBER_TYPES,
  sanitizeInterfaceList,
} from './types';

export const INTERFACE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Interface Declaration Wrapper Block: public interface IPlayer extends IEntity, IDamageable { ... }
  {
    type: 'interface_declaration',
    message0: '%1 interface %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'INTERFACE_NAME',
        text: 'IMyInterface',
      },
    ],
    message1: 'extends %1',
    args1: [
      {
        type: 'field_input',
        name: 'EXTENDS_INTERFACES',
        text: '',
      },
    ],
    message2: 'signatures & contracts %1',
    args2: [
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'structure_blocks',
    tooltip:
      'Defines an Interface contract declaring abstract method signatures and property prototypes with optional super-interface inheritance.',
    helpUrl: '',
  },

  // 2. Interface Abstract Method Signature: function update(delta: Float): Void;
  {
    type: 'interface_method_signature',
    message0: 'function %1 ( %2 ) : %3 ;',
    args0: [
      {
        type: 'field_input',
        name: 'METHOD_NAME',
        text: 'update',
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
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Declares an abstract interface method signature without body (e.g. function update(delta: Float): Void;).',
    helpUrl: '',
  },

  // 3. Interface Property Contract Signature: var isAlive(default, null): Bool;
  {
    type: 'interface_property_signature',
    message0: 'var %1 ( %2 , %3 ) : %4 ;',
    args0: [
      {
        type: 'field_input',
        name: 'PROPERTY_NAME',
        text: 'isAlive',
      },
      {
        type: 'field_dropdown',
        name: 'READ_ACCESS',
        options: PROPERTY_ACCESSOR_READ_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'WRITE_ACCESS',
        options: PROPERTY_ACCESSOR_WRITE_OPTIONS,
      },
      {
        type: 'input_value',
        name: 'PROPERTY_TYPE',
        check: 'Type',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Declares an interface property contract with read/write accessor specifiers (e.g. var isAlive(default, null): Bool;).',
    helpUrl: '',
  },
];

export interface InterfaceValidationResult {
  valid: boolean;
  invalidBlockTypes: string[];
  error?: string;
}

/**
 * Validates that all connected children in an interface's MEMBERS slot are abstract signatures.
 */
export function validateInterfaceMembers(block: Blockly.Block): InterfaceValidationResult {
  const memberInput = block.getInput('MEMBERS');
  if (!memberInput || !memberInput.connection) {
    return { valid: true, invalidBlockTypes: [] };
  }

  const targetBlock =
    memberInput.connection.targetBlock() ||
    (memberInput.connection.targetConnection?.getSourceBlock() ?? null);

  let currentBlock: Blockly.Block | null = targetBlock;
  const invalidBlockTypes: string[] = [];

  while (currentBlock) {
    if (!VALID_INTERFACE_MEMBER_TYPES.has(currentBlock.type)) {
      invalidBlockTypes.push(currentBlock.type);
      const warningMsg = `Block '${currentBlock.type}' is not allowed in an interface. Only abstract method and property signatures are permitted.`;
      currentBlock.setWarningText(warningMsg);
      (currentBlock as unknown as { warningText_?: string }).warningText_ = warningMsg;
    } else {
      currentBlock.setWarningText(null);
      (currentBlock as unknown as { warningText_?: string | null }).warningText_ = null;
    }
    currentBlock = currentBlock.getNextBlock();
  }

  if (invalidBlockTypes.length > 0) {
    const error =
      'Interface contains invalid concrete members. Only abstract method signatures and property contracts are allowed.';
    block.setWarningText(error);
    (block as unknown as { warningText_?: string }).warningText_ = error;
    return {
      valid: false,
      invalidBlockTypes,
      error,
    };
  }

  block.setWarningText(null);
  (block as unknown as { warningText_?: string | null }).warningText_ = null;
  return {
    valid: true,
    invalidBlockTypes: [],
  };
}

/**
 * Attaches real-time field validators and member constraint listeners to interface blocks.
 */
function attachInterfaceBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    // Validate Interface Name
    const nameField = this.getField('INTERFACE_NAME');
    if (nameField) {
      nameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid interface identifier '${trimmed}'. Must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Method Name on signature
    const methodNameField = this.getField('METHOD_NAME');
    if (methodNameField) {
      methodNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid method identifier '${trimmed}'.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Property Name on signature
    const propNameField = this.getField('PROPERTY_NAME');
    if (propNameField) {
      propNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid property identifier '${trimmed}'.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Extended Interfaces
    const extendsField = this.getField('EXTENDS_INTERFACES');
    if (extendsField) {
      extendsField.setValidator((newExtends: string) => {
        return sanitizeInterfaceList(newExtends);
      });
    }

    // Attach workspace change listener to validate interface member slot
    if (this.workspace && blockType === 'interface_declaration') {
      this.workspace.addChangeListener(() => {
        if (!this.isDeadOrDying?.()) {
          validateInterfaceMembers(this);
        }
      });
    }
  };
}

/**
 * Registers all Interface blocks into Blockly's global registry.
 */
export function registerInterfaceBlocks(): void {
  INTERFACE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachInterfaceBlockValidators(def.type);
  });
}
