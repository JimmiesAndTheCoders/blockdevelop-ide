import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { IMPORT_KIND_OPTIONS, sanitizePackageNamespace } from './types';

export const IMPORT_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Unified Import Statement Block
  // Example: import com.example.Player as Hero; or import com.example.*;
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
    style: 'event_blocks',
    tooltip: 'Imports a module, class, interface, or wildcard (.*) with optional alias (as Alias).',
    helpUrl: '',
  },

  // 2. Wildcard Import Statement Block
  // Example: import com.example.utils.*;
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
    style: 'event_blocks',
    tooltip: 'Imports all public symbols in a package using wildcard notation (import pkg.*;).',
    helpUrl: '',
  },

  // 3. Aliased Import Statement Block
  // Example: import com.example.math.Vector3 as Vec3;
  {
    type: 'import_alias',
    message0: 'import %1 as %2 ;',
    args0: [
      {
        type: 'field_input',
        name: 'MODULE_PATH',
        text: 'com.example.math.Vector3',
      },
      {
        type: 'field_input',
        name: 'ALIAS',
        text: 'Vec3',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'event_blocks',
    tooltip: 'Imports a symbol under a local alias identifier (import Target as Alias;).',
    helpUrl: '',
  },
];

/**
 * Registers all Import & Dependency blocks into Blockly's global registry.
 */
export function registerImportBlocks(): void {
  IMPORT_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });

  // Attach field validator to sanitize import paths in real-time
  const importBlock = Blockly.Blocks['import_statement'];
  if (importBlock) {
    const originalInit = importBlock.init;
    importBlock.init = function (this: Blockly.Block) {
      if (originalInit) originalInit.call(this);
      const field = this.getField('MODULE_PATH');
      if (field) {
        field.setValidator((newValue: string) => {
          return sanitizePackageNamespace(newValue);
        });
      }
    };
  }
}
