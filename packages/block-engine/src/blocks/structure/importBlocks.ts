import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  IMPORT_KIND_OPTIONS,
  sanitizePackageNamespace,
  isValidImportPath,
} from './types';

export const IMPORT_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Single Type / Class Import: import haxe.ds.Vector;
  {
    type: 'import_type',
    message0: 'import %1 ;',
    args0: [
      {
        type: 'field_input',
        name: 'MODULE_PATH',
        text: 'haxe.ds.Vector',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Imports an individual class, interface, enum, or type into the file scope (import path.Type;).',
    helpUrl: '',
  },

  // 2. Wildcard Package Import: import com.game.utils.*;
  {
    type: 'import_wildcard',
    message0: 'import %1 .* ;',
    args0: [
      {
        type: 'field_input',
        name: 'PACKAGE_PATH',
        text: 'com.example.utils',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Imports all public symbols in a package using wildcard notation (import pkg.*;).',
    helpUrl: '',
  },

  // 3. Aliased Type Import: import haxe.ds.StringMap as Dictionary;
  {
    type: 'import_alias',
    message0: 'import %1 as %2 ;',
    args0: [
      {
        type: 'field_input',
        name: 'MODULE_PATH',
        text: 'haxe.ds.StringMap',
      },
      {
        type: 'field_input',
        name: 'ALIAS',
        text: 'Dictionary',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Imports a symbol under a local alias identifier (import Target as Alias;).',
    helpUrl: '',
  },

  // 4. Extension / Mixin Statement: using StringTools;
  {
    type: 'using_mixin',
    message0: 'using %1 ;',
    args0: [
      {
        type: 'field_input',
        name: 'MODULE_PATH',
        text: 'StringTools',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Brings static extension methods into scope for mixin syntax (using path.ExtensionClass;).',
    helpUrl: '',
  },

  // 5. Unified Import Statement Block
  {
    type: 'import_statement',
    message0: 'import %1 %2 as %3 ;',
    args0: [
      {
        type: 'field_dropdown',
        name: 'KIND',
        options: IMPORT_KIND_OPTIONS,
      },
      {
        type: 'field_input',
        name: 'MODULE_PATH',
        text: 'com.example.module.Symbol',
      },
      {
        type: 'field_input',
        name: 'ALIAS',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'structure_blocks',
    tooltip: 'Imports a module, class, interface, or wildcard (.*) with optional alias (as Alias).',
    helpUrl: '',
  },
];

/**
 * Attaches real-time field validators and warning indicators to import and using blocks.
 */
function attachImportFieldValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    const pathField = this.getField('MODULE_PATH') || this.getField('PACKAGE_PATH');
    if (pathField) {
      pathField.setValidator((newValue: string) => {
        const sanitized = sanitizePackageNamespace(newValue);
        if (!isValidImportPath(sanitized) && sanitized.length > 0) {
          this.setWarningText(`Invalid import path '${sanitized}'. Use dot-separated notation (e.g. haxe.ds.Vector).`);
        } else {
          this.setWarningText(null);
        }
        return sanitized;
      });
    }

    const aliasField = this.getField('ALIAS');
    if (aliasField) {
      aliasField.setValidator((newAlias: string) => {
        const trimmed = newAlias.trim();
        if (trimmed && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          this.setWarningText(`Invalid alias '${trimmed}'. Identifiers must start with a letter or underscore.`);
        } else {
          this.setWarningText(null);
        }
        return trimmed;
      });
    }
  };
}

/**
 * Registers all Import & Dependency blocks into Blockly's global registry.
 */
export function registerImportBlocks(): void {
  IMPORT_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachImportFieldValidators(def.type);
  });
}
