import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';

import type { CustomBlockDefinition } from '../types';
import { registerLogicBlocks, LOGIC_BLOCK_DEFINITIONS } from './logic';
import { registerMathBlocks, MATH_BLOCK_DEFINITIONS } from './math';
import { registerTextBlocks, TEXT_BLOCK_DEFINITIONS } from './text';
import { registerVariableBlocks, VARIABLE_BLOCK_DEFINITIONS } from './variables';
import { registerFunctionBlocks, FUNCTION_BLOCK_DEFINITIONS } from './functions';
import {
  registerTypeBlocks,
  TYPE_BLOCK_DEFINITIONS,
  registerScopedVariableBlocks,
  SCOPED_VARIABLE_BLOCK_DEFINITIONS,
} from './scoping';
import {
  registerArray1DBlocks,
  ARRAY_1D_BLOCK_DEFINITIONS,
  registerMatrix2DBlocks,
  MATRIX_2D_BLOCK_DEFINITIONS,
} from './collections';
import {
  registerPackageBlocks,
  PACKAGE_BLOCK_DEFINITIONS,
  registerClassBlocks,
  CLASS_BLOCK_DEFINITIONS,
  registerImportBlocks,
  IMPORT_BLOCK_DEFINITIONS,
  registerInterfaceBlocks,
  INTERFACE_BLOCK_DEFINITIONS,
  registerEnumBlocks,
  ENUM_BLOCK_DEFINITIONS,
  registerPropertyBlocks,
  PROPERTY_BLOCK_DEFINITIONS,
  registerMethodBlocks,
  METHOD_BLOCK_DEFINITIONS,
} from './structure';

// Set English locale globally
Blockly.setLocale(En as unknown as Record<string, string>);

export * from './logic';
export * from './math';
export * from './text';
export * from './variables';
export * from './functions';
export * from './scoping';
export * from './collections';
export * from './structure';

export const CORE_EVENT_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  {
    type: 'event_on_start',
    message0: 'when project starts',
    nextStatement: null,
    style: 'event_blocks',
    tooltip: 'Runs when the project initializes',
    helpUrl: '',
  },
  {
    type: 'event_on_update',
    message0: 'every frame update',
    nextStatement: null,
    style: 'event_blocks',
    tooltip: 'Runs on every frame update',
    helpUrl: '',
  },
];

export const CORE_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  ...CORE_EVENT_BLOCK_DEFINITIONS,
  ...PACKAGE_BLOCK_DEFINITIONS,
  ...CLASS_BLOCK_DEFINITIONS,
  ...INTERFACE_BLOCK_DEFINITIONS,
  ...ENUM_BLOCK_DEFINITIONS,
  ...PROPERTY_BLOCK_DEFINITIONS,
  ...METHOD_BLOCK_DEFINITIONS,
  ...IMPORT_BLOCK_DEFINITIONS,
  ...TYPE_BLOCK_DEFINITIONS,
  ...SCOPED_VARIABLE_BLOCK_DEFINITIONS,
  ...ARRAY_1D_BLOCK_DEFINITIONS,
  ...MATRIX_2D_BLOCK_DEFINITIONS,
  ...LOGIC_BLOCK_DEFINITIONS,
  ...MATH_BLOCK_DEFINITIONS,
  ...TEXT_BLOCK_DEFINITIONS,
  ...VARIABLE_BLOCK_DEFINITIONS,
  ...FUNCTION_BLOCK_DEFINITIONS,
];

export function registerBlockDefinitions(definitions = CORE_BLOCK_DEFINITIONS): void {
  registerPackageBlocks();
  registerClassBlocks();
  registerInterfaceBlocks();
  registerEnumBlocks();
  registerPropertyBlocks();
  registerMethodBlocks();
  registerImportBlocks();
  registerTypeBlocks();
  registerScopedVariableBlocks();
  registerArray1DBlocks();
  registerMatrix2DBlocks();
  registerLogicBlocks();
  registerMathBlocks();
  registerTextBlocks();
  registerVariableBlocks();
  registerFunctionBlocks();

  definitions.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
