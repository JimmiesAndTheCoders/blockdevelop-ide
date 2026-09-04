import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  CLASS_ACCESS_OPTIONS,
  CLASS_MODIFIER_OPTIONS,
  sanitizePackageNamespace,
} from './types';

export const CLASS_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Full-Featured Class Declaration Block
  {
    type: 'class_declaration',
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
    message5: 'static members %1',
    args5: [
      {
        type: 'input_statement',
        name: 'STATIC_MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'structure_blocks',
    tooltip:
      'Enclosing Class Definition with inheritance (extends), interfaces (implements), and dedicated slots for Fields, Constructor, Methods, and Static Members.',
    helpUrl: '',
  },

  // 2. Backward-compatibility alias for class_declaration
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
    message5: 'static members %1',
    args5: [
      {
        type: 'input_statement',
        name: 'STATIC_MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'structure_blocks',
    tooltip:
      'Enclosing Class Definition wrapper separating Fields, Constructor, Methods, and Static Members with inheritance and interfaces.',
    helpUrl: '',
  },

  // 3. Typed Class Constructor Declaration: public function new(params) { ... }
  {
    type: 'class_constructor_declaration',
    message0: '%1 constructor new ( %2 )',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ACCESS',
        options: CLASS_ACCESS_OPTIONS,
      },
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
    style: 'structure_blocks',
    tooltip: 'Class constructor definition (new) with access modifiers (public/private), typed parameters, and initialization body.',
    helpUrl: '',
  },

  // 4. Backward-compatibility alias for class_constructor_declaration
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
    style: 'structure_blocks',
    tooltip: 'Class constructor method (new) executed when an instance is created.',
    helpUrl: '',
  },

  // 5. Super Constructor Call Statement: super(arg0, arg1, arg2);
  {
    type: 'super_constructor_call',
    message0: 'super ( %1 %2 %3 ) ;',
    args0: [
      {
        type: 'input_value',
        name: 'ARG0',
      },
      {
        type: 'input_value',
        name: 'ARG1',
      },
      {
        type: 'input_value',
        name: 'ARG2',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Invokes the superclass constructor (super(...)) with arguments in a derived class constructor.',
    helpUrl: '',
  },

  // 6. Instance Instantiation Expression: new ClassName(arg0, arg1)
  {
    type: 'instance_instantiation',
    message0: 'new %1 ( %2 %3 )',
    args0: [
      {
        type: 'field_input',
        name: 'CLASS_NAME',
        text: 'Player',
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
    tooltip: 'Instantiates a new instance of a class (new ClassName(arguments)).',
    helpUrl: '',
  },
];

/**
 * Attaches real-time field validators and warning indicators to class and instantiation blocks.
 */
function attachClassBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    // Validate Class Name on class_declaration and instance_instantiation
    const classNameField = this.getField('CLASS_NAME');
    if (classNameField) {
      classNameField.setValidator((newVal: string) => {
        const trimmed = newVal.trim();
        if (!trimmed || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid class identifier '${trimmed}'. Must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }

    // Validate Superclass (extends)
    const extendsField = this.getField('EXTENDS_CLASS');
    if (extendsField) {
      extendsField.setValidator((newExtends: string) => {
        return sanitizePackageNamespace(newExtends);
      });
    }

    // Validate Interfaces (implements)
    const implementsField = this.getField('IMPLEMENTS_INTERFACES');
    if (implementsField) {
      implementsField.setValidator((newInterfaces: string) => {
        return newInterfaces
          .split(',')
          .map((item) => sanitizePackageNamespace(item))
          .join(', ');
      });
    }
  };
}

/**
 * Registers all Class & Scope wrapper blocks into Blockly's global registry.
 */
export function registerClassBlocks(): void {
  CLASS_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachClassBlockValidators(def.type);
  });
}