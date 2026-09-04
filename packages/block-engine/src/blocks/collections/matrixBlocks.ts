import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { MATRIX_DIMENSION_OPTIONS } from './types';

export const MATRIX_2D_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Create 2D Matrix / Grid: new Array<Array<T>>(rows, cols, initialValue)
  {
    type: 'matrix_create_2d',
    message0: 'create 2D grid rows %1 cols %2 fill with %3',
    args0: [
      {
        type: 'input_value',
        name: 'ROWS',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'COLS',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'INITIAL_VALUE',
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip:
      'Initializes a 2D matrix grid Array<Array<T>> with specified rows, cols, and default value.',
    helpUrl: '',
  },

  // 2. Matrix Get Cell: grid[row][col]
  {
    type: 'matrix_get_2d',
    message0: 'in grid %1 get cell at row %2 col %3',
    args0: [
      {
        type: 'input_value',
        name: 'MATRIX',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ROW',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'COL',
        check: 'Number',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Retrieves the value of a cell at (row, col) in a 2D matrix.',
    helpUrl: '',
  },

  // 3. Matrix Set Cell: grid[row][col] = value
  {
    type: 'matrix_set_2d',
    message0: 'in grid %1 set cell at row %2 col %3 = %4',
    args0: [
      {
        type: 'input_value',
        name: 'MATRIX',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ROW',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'COL',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Sets the value of a cell at (row, col) in a 2D matrix.',
    helpUrl: '',
  },

  // 4. Matrix Read Dimensions: grid.length (rows) or grid[0].length (cols)
  {
    type: 'matrix_dimensions',
    message0: 'in grid %1 get %2',
    args0: [
      {
        type: 'input_value',
        name: 'MATRIX',
        check: 'Array',
      },
      {
        type: 'field_dropdown',
        name: 'DIMENSION',
        options: MATRIX_DIMENSION_OPTIONS,
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns the number of rows or columns in a 2D matrix.',
    helpUrl: '',
  },

  // 5. Matrix Fill Region: fill grid or sub-region with value
  {
    type: 'matrix_fill_2d',
    message0: 'fill grid %1 with %2',
    args0: [
      {
        type: 'input_value',
        name: 'MATRIX',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Populates all cells in the 2D matrix with the specified fill value.',
    helpUrl: '',
  },
];

/**
 * Registers all 2D Matrix & Grid blocks into Blockly's global registry.
 */
export function registerMatrix2DBlocks(): void {
  MATRIX_2D_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
