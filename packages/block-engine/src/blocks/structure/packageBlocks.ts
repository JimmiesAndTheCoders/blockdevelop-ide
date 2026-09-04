import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import {
  sanitizePackageNamespace,
  isValidPackageNamespace,
  PACKAGE_BLOCK_TYPES,
} from './types';

export const PACKAGE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Top-Level Package Declaration Statement Node: package com.example.app;
  {
    type: 'package_declaration',
    message0: 'package %1 ;',
    args0: [
      {
        type: 'field_input',
        name: 'PACKAGE_NAME',
        text: 'com.example.app',
      },
    ],
    nextStatement: null,
    style: 'structure_blocks',
    tooltip: 'Declares the top-level package namespace for this source file (e.g. package com.example.app;).',
    helpUrl: '',
  },

  // 2. Scoped Package Block Wrapper: package com.example.app { ... }
  {
    type: 'package_block_wrapper',
    message0: 'package %1',
    args0: [
      {
        type: 'field_input',
        name: 'PACKAGE_NAME',
        text: 'com.example.app',
      },
    ],
    message1: 'contents %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    style: 'structure_blocks',
    tooltip: 'Scoped package container enclosing classes, interfaces, enums, and module members.',
    helpUrl: '',
  },

  // 3. Backward-compatibility alias for package_block_wrapper
  {
    type: 'package_declare',
    message0: 'package %1',
    args0: [
      {
        type: 'field_input',
        name: 'PACKAGE_NAME',
        text: 'com.example.app',
      },
    ],
    message1: 'contents %1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    style: 'structure_blocks',
    tooltip: 'Top-level package container enclosing classes, interfaces, and module declarations.',
    helpUrl: '',
  },

  // 4. Backward-compatibility alias for package_declaration
  {
    type: 'package_declare_header',
    message0: 'package %1 ;',
    args0: [
      {
        type: 'field_input',
        name: 'PACKAGE_NAME',
        text: 'com.example.app',
      },
    ],
    nextStatement: null,
    style: 'structure_blocks',
    tooltip: 'Top-level package statement header without enclosing braces.',
    helpUrl: '',
  },
];

/**
 * Attaches real-time field validation and warning badges to package blocks.
 */
function attachPackageBlockValidators(blockType: string): void {
  const blockDef = Blockly.Blocks[blockType];
  if (!blockDef) return;

  const originalInit = blockDef.init;
  blockDef.init = function (this: Blockly.Block) {
    if (originalInit) originalInit.call(this);

    const field = this.getField('PACKAGE_NAME');
    if (field) {
      field.setValidator((newValue: string) => {
        const sanitized = sanitizePackageNamespace(newValue);
        if (!isValidPackageNamespace(sanitized)) {
          this.setWarningText('Invalid package identifier. Use standard reverse-DNS dot notation (e.g. com.example.game).');
        } else {
          this.setWarningText(null);
        }
        return sanitized;
      });
    }
  };
}

/**
 * Registers package blocks and binds field validators.
 */
export function registerPackageBlocks(): void {
  PACKAGE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
    attachPackageBlockValidators(def.type);
  });
}

/**
 * Validates that a workspace contains at most one package declaration block.
 * When duplicates exist, attaches a visible warning badge to the duplicate block.
 */
export function validateWorkspacePackageStructure(workspace: Blockly.Workspace): {
  valid: boolean;
  packageBlockId: string | null;
  error?: string;
} {
  const allBlocks = workspace.getAllBlocks(false);
  const packageBlocks = allBlocks.filter((b) => PACKAGE_BLOCK_TYPES.has(b.type));

  if (packageBlocks.length > 1) {
    packageBlocks.forEach((block, index) => {
      if (index > 0) {
        block.setWarningText(
          'Multiple package definitions detected. Only one package declaration is allowed per .block file.',
        );
      } else {
        block.setWarningText(null);
      }
    });

    return {
      valid: false,
      packageBlockId: packageBlocks[1]?.id ?? null,
      error: 'Multiple package definitions detected. Only one package declaration is allowed per file.',
    };
  }

  if (packageBlocks[0]) {
    packageBlocks[0].setWarningText(null);
  }

  return {
    valid: true,
    packageBlockId: packageBlocks[0]?.id ?? null,
  };
}
