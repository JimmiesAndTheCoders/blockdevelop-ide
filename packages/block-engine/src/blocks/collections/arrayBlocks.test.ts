import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  ARRAY_1D_BLOCK_DEFINITIONS,
  ARRAY_SORT_DIRECTION_OPTIONS,
  ARRAY_TRANSFORMATION_MODE_OPTIONS,
} from './index';

describe('Phase 4.1 - Task 2.1 & 2.2: 1D Array & Mutation Operations Suite', () => {
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

  it('should define all 18 1D array construction, stack, queue, and mutation blocks', () => {
    expect(ARRAY_1D_BLOCK_DEFINITIONS.length).toBe(18);
    const types = ARRAY_1D_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('array_create_empty');
    expect(types).toContain('array_create_with');
    expect(types).toContain('array_create_typed');
    expect(types).toContain('array_length');
    expect(types).toContain('array_get_index');
    expect(types).toContain('array_set_index');
    expect(types).toContain('array_push');
    expect(types).toContain('array_pop');
    expect(types).toContain('array_unshift');
    expect(types).toContain('array_shift');
    expect(types).toContain('array_insert_at');
    expect(types).toContain('array_remove_at');
    expect(types).toContain('array_slice');
    expect(types).toContain('array_splice');
    expect(types).toContain('array_indexOf');
    expect(types).toContain('array_contains');
    expect(types).toContain('array_reverse');
    expect(types).toContain('array_sort');
  });

  it('should expose sort and transformation dropdown options', () => {
    const sortDirections = ARRAY_SORT_DIRECTION_OPTIONS.map(([_, v]) => v);
    expect(sortDirections).toEqual(['ASC', 'DESC']);

    const modes = ARRAY_TRANSFORMATION_MODE_OPTIONS.map(([_, v]) => v);
    expect(modes).toEqual(['IN_PLACE', 'COPY']);
  });

  it('should instantiate array_push and array_pop stack operations', () => {
    const pushBlock = workspace.newBlock('array_push');
    const popBlock = workspace.newBlock('array_pop');

    expect(pushBlock.previousConnection).not.toBeNull();
    expect(pushBlock.nextConnection).not.toBeNull();
    expect(popBlock.outputConnection).not.toBeNull();

    const arrBlock = workspace.newBlock('array_create_empty');
    const itemBlock = workspace.newBlock('math_number');

    pushBlock.getInput('ARRAY')?.connection?.connect(arrBlock.outputConnection!);
    pushBlock.getInput('ITEM')?.connection?.connect(itemBlock.outputConnection!);

    expect(pushBlock.getChildren(false).length).toBe(2);
  });

  it('should instantiate array_unshift and array_shift queue operations', () => {
    const unshiftBlock = workspace.newBlock('array_unshift');
    const shiftBlock = workspace.newBlock('array_shift');

    expect(unshiftBlock.previousConnection).not.toBeNull();
    expect(shiftBlock.outputConnection).not.toBeNull();

    const arrBlock = workspace.newBlock('array_create_empty');
    shiftBlock.getInput('ARRAY')?.connection?.connect(arrBlock.outputConnection!);

    expect(shiftBlock.getChildren(false).length).toBe(1);
  });

  it('should instantiate array_insert_at and array_remove_at', () => {
    const insertBlock = workspace.newBlock('array_insert_at');
    const removeBlock = workspace.newBlock('array_remove_at');

    expect(insertBlock.previousConnection).not.toBeNull();
    expect(removeBlock.previousConnection).not.toBeNull();
  });

  it('should instantiate array_slice and array_splice sub-array operations', () => {
    const sliceBlock = workspace.newBlock('array_slice');
    const spliceBlock = workspace.newBlock('array_splice');

    expect(sliceBlock.outputConnection?.getCheck()).toContain('Array');
    expect(spliceBlock.previousConnection).not.toBeNull();
  });

  it('should instantiate array_indexOf and array_contains search queries', () => {
    const indexOfBlock = workspace.newBlock('array_indexOf');
    const containsBlock = workspace.newBlock('array_contains');

    expect(indexOfBlock.outputConnection?.getCheck()).toContain('Number');
    expect(containsBlock.outputConnection?.getCheck()).toContain('Boolean');
  });

  it('should instantiate array_reverse and array_sort transformation blocks', () => {
    const reverseBlock = workspace.newBlock('array_reverse');
    const sortBlock = workspace.newBlock('array_sort');

    expect(reverseBlock.outputConnection?.getCheck()).toContain('Array');
    expect(sortBlock.outputConnection?.getCheck()).toContain('Array');

    const sortDir = sortBlock.getField('DIRECTION') as Blockly.FieldDropdown;
    sortDir.setValue('DESC');
    expect(sortDir.getValue()).toBe('DESC');
  });
});
