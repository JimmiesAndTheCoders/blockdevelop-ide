import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { sanitizePackageNamespace } from './types';

export const PACKAGE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Top-Level Package Declaration Wrapper Node
  // Example: package com.example.app { ... }
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
    style: 'event_blocks',
    tooltip:
      'Top-level package/namespace declaration. Defines the namespace containing classes, interfaces, and imports.',
    helpUrl: '',
  },

  // 2. Simple Top-Level Package Header Node (Statement Form)
  // Example: package com.example.app;
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
    style: 'event_blocks',
    tooltip: 'Top-level package statement header without enclosing braces.',
    helpUrl: '',
  },
];

/**
 * Registers package blocks with custom validator on PACKAGE_NAME field to auto-sanitize namespaces.
 */
export function registerPackageBlocks(): void {
  PACKAGE_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });

  // Attach field validator to sanitize package names in real-time
  const pkgBlock = Blockly.Blocks['package_declare'];
  if (pkgBlock) {
    const originalInit = pkgBlock.init;
    pkgBlock.init = function (this: Blockly.Block) {
      if (originalInit) originalInit.call(this);
      const field = this.getField('PACKAGE_NAME');
      if (field) {
        field.setValidator((newValue: string) => {
          return sanitizePackageNamespace(newValue);
        });
      }
    };
  }

  const pkgHeaderBlock = Blockly.Blocks['package_declare_header'];
  if (pkgHeaderBlock) {
    const originalInit = pkgHeaderBlock.init;
    pkgHeaderBlock.init = function (this: Blockly.Block) {
      if (originalInit) originalInit.call(this);
      const field = this.getField('PACKAGE_NAME');
      if (field) {
        field.setValidator((newValue: string) => {
          return sanitizePackageNamespace(newValue);
        });
      }
    };
  }
}

/**
 * Validates that a workspace contains at most one package declaration block at the top level.
 */
export function validateWorkspacePackageStructure(
  workspace: Blockly.Workspace
): { valid: boolean; packageBlockId: string | null; error?: string } {
  const topBlocks = workspace.getTopBlocks(false);
  const packageBlocks = topBlocks.filter(
    (b) => b.type === 'package_declare' || b.type === 'package_declare_header'
  );

  if (packageBlocks.length > 1) {
    return {
      valid: false,
      packageBlockId: packageBlocks[1]?.id ?? null,
      error: 'Multiple package definitions detected. Only one package declaration is allowed per file.',
    };
  }

  return {
    valid: true,
    packageBlockId: packageBlocks[0]?.id ?? null,
  };
}
