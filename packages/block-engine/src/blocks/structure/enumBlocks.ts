import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  CLASS_ACCESS_OPTIONS,
  VALID_ENUM_MEMBER_TYPES,
} from './types';

export const ENUM_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Enum Definition Wrapper Block: public enum GameState { ... }
  {
    type: 'enum_declaration',
    message0: '%1 enum %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'ENUM_NAME',
        text: 'GameState',
      },
    ],
    message1: 'variants & constructors %1',
    args1: [
      {
        type: 'input_statement',
        name: 'VARIANTS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'structure_blocks',
    tooltip: 'Defines an Enumeration (Enum) or Algebraic Data Type with variant constructors.',
    helpUrl: '',
  },

  // 2. Simple Scalar Enum Constructor: case UP; or case PLAYING;
  {
    type: 'enum_constructor_item',
    message0: 'case %1 ;',
    args0: [
      {
        type: 'field_input',
        name: 'VARIANT_NAME',
        text: 'UP',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Defines a scalar enum variant constructor without parameters.',
    helpUrl: '',
  },

  // 3. Parameterized Enum Constructor (ADT): case Rgb(r: Int, g: Int, b: Int);
  {
    type: 'enum_constructor_parameterized',
    message0: 'case %1 ( %2 ) ;',
    args0: [
      {
        type: 'field_input',
        name: 'VARIANT_NAME',
        text: 'Color',
      },
      {
        type: 'input_statement',
        name: 'PARAMS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Defines an Algebraic Data Type enum constructor with typed payload parameters (e.g. Color(r: Int, g: Int, b: Int)).',
    helpUrl: '',
  },

  // 4. Enum Value Reference & Constructor Invocation Expression: GameState.PLAYING or Color.Rgb(255, 0, 0)
  {
    type: 'enum_value_reference',
    message0: '%1 . %2 ( %3 %4 )',
    args0: [
      {
        type: 'field_input',
        name: 'ENUM_NAME',
        text: 'GameState',
      },
      {
        type: 'field_input',
        name: 'VARIANT_NAME',
        text: 'PLAYING',
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
    style: 'structure_blocks',
    tooltip: 'References an enum variant or invokes a parameterized constructor (e.g. GameState.PLAYING or Color.Rgb(255, 0)).',
    helpUrl: '',
  },

  // 5. Pattern Matching Switch Block for Enum Cases: match target { case Variant(bindings) => do }
  {
    type: 'enum_pattern_match',
    message0: 'match enum %1 case . %2 ( %3 )',
    args0: [
      {
        type: 'input_value',
        name: 'TARGET',
      },
      {
        type: 'field_input',
        name: 'MATCH_CASE',
        text: 'Color',
      },
      {
        type: 'field_input',
        name: 'BINDINGS',
        text: 'r, g, b',
      },
    ],
    message1: 'then do %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    message2: 'otherwise default %1',
    args2: [
      {
        type: 'input_statement',
        name: 'DEFAULT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Pattern matches on an enum variant, extracting payload parameters into local variable bindings.',
    helpUrl: '',
  },
];

export interface EnumValidationResult {
  valid: boolean;
  invalidBlockTypes: string[];
  error?: string;
}

/**
 * Validates that all connected children in an enum's VARIANTS slot are valid enum constructors.
 */
export function validateEnumMembers(block: Blockly.Block): EnumValidationResult {
  const memberInput = block.getInput('VARIANTS');
  if (!memberInput || !memberInput.connection) {
    return { valid: true, invalidBlockTypes: [] };
  }

  const targetBlock =
    memberInput.connection.targetBlock() ||
    (memberInput.connection.targetConnection?.getSourceBlock() ?? null);

  let currentBlock: Blockly.Block | null = targetBlock;
  const invalidBlockTypes: string[] = [];

  while (currentBlock) {
    if (!VALID_ENUM_MEMBER_TYPES.has(currentBlock.type)) {
      invalidBlockTypes.push(currentBlock.type);
      const warningMsg = `Block '${currentBlock.type}' is not allowed inside an enum. Only enum variant constructors are permitted.`;
      currentBlock.setWarningText(warningMsg);
      (currentBlock as unknown as { warningText_?: string }).warningText_ = warningMsg;
    } else {
      currentBlock.setWarningText(null);
      (currentBlock as unknown as { warningText_?: string | null }).warningText_ = null;
    }
    currentBlock = currentBlock.getNextBlock();
  }

  if (invalidBlockTypes.length > 0) {
    const error = 'Enum contains invalid member blocks. Only enum variant constructors are allowed.';
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
 * Attaches real-time field validators and member constraint listeners to enum blocks.
 */
function attachEnumBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    // Validate Enum Name
    const enumNameField = this.getField('ENUM_NAME');
    if (enumNameField) {
      enumNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid enum identifier '${trimmed}'. Must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Variant / Match Case Name
    const variantNameField = this.getField('VARIANT_NAME') || this.getField('MATCH_CASE');
    if (variantNameField) {
      variantNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid constructor identifier '${trimmed}'.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Attach workspace change listener to validate enum member container
    if (this.workspace && blockType === 'enum_declaration') {
      this.workspace.addChangeListener(() => {
        if (!this.isDeadOrDying?.()) {
          validateEnumMembers(this);
        }
      });
    }
  };
}

/**
 * Registers all Enum blocks into Blockly's global registry.
 */
export function registerEnumBlocks(): void {
  ENUM_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachEnumBlockValidators(def.type);
  });
}
