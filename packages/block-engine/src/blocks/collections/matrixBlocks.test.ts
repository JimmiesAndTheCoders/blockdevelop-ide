import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import { MATRIX_2D_BLOCK_DEFINITIONS, MATRIX_DIMENSION_OPTIONS } from './index';

describe('Phase 4.1 - Task 2.3: 2D Matrix & Grid Operations Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerBlockDefinitions();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
  });

  it('should define all 5 2D matrix blocks in schema definitions', () => {
    expect(MATRIX_2D_BLOCK_DEFINITIONS.length).toBe(5);
    const types = MATRIX_2D_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('matrix_create_2d');
    expect(types).toContain('matrix_get_2d');
    expect(types).toContain('matrix_set_2d');
    expect(types).toContain('matrix_dimensions');
    expect(types).toContain('matrix_fill_2d');
  });

  it('should expose matrix dimension options', () => {
    const dims = MATRIX_DIMENSION_OPTIONS.map(([_, v]) => v);
    expect(dims).toEqual(['ROWS', 'COLS']);
  });

  it('should instantiate matrix_create_2d and connect rows, cols, and initial fill value', () => {
    const matrixBlock = workspace.newBlock('matrix_create_2d');
    expect(matrixBlock.type).toBe('matrix_create_2d');
    expect(matrixBlock.outputConnection?.getCheck()).toContain('Array');

    const rowsBlock = workspace.newBlock('math_number');
    const colsBlock = workspace.newBlock('math_number');
    const fillBlock = workspace.newBlock('math_number');

    matrixBlock.getInput('ROWS')?.connection?.connect(rowsBlock.outputConnection!);
    matrixBlock.getInput('COLS')?.connection?.connect(colsBlock.outputConnection!);
    matrixBlock.getInput('INITIAL_VALUE')?.connection?.connect(fillBlock.outputConnection!);

    expect(matrixBlock.getChildren(false).length).toBe(3);
  });

  it('should instantiate matrix_get_2d and matrix_set_2d cell access blocks', () => {
    const getCellBlock = workspace.newBlock('matrix_get_2d');
    const setCellBlock = workspace.newBlock('matrix_set_2d');

    expect(getCellBlock.outputConnection).not.toBeNull();
    expect(setCellBlock.previousConnection).not.toBeNull();
    expect(setCellBlock.nextConnection).not.toBeNull();

    const gridBlock = workspace.newBlock('array_create_empty');
    const rowBlock = workspace.newBlock('math_number');
    const colBlock = workspace.newBlock('math_number');
    const valBlock = workspace.newBlock('text_literal');

    setCellBlock.getInput('MATRIX')?.connection?.connect(gridBlock.outputConnection!);
    setCellBlock.getInput('ROW')?.connection?.connect(rowBlock.outputConnection!);
    setCellBlock.getInput('COL')?.connection?.connect(colBlock.outputConnection!);
    setCellBlock.getInput('VALUE')?.connection?.connect(valBlock.outputConnection!);

    expect(setCellBlock.getChildren(false).length).toBe(4);
  });

  it('should instantiate matrix_dimensions and matrix_fill_2d blocks', () => {
    const dimBlock = workspace.newBlock('matrix_dimensions');
    const fillBlock = workspace.newBlock('matrix_fill_2d');

    expect(dimBlock.outputConnection?.getCheck()).toContain('Number');
    expect(fillBlock.previousConnection).not.toBeNull();

    const dimField = dimBlock.getField('DIMENSION') as Blockly.FieldDropdown;
    dimField.setValue('COLS');
    expect(dimField.getValue()).toBe('COLS');
  });
});
