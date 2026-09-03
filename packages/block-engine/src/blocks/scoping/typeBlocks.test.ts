import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import {
  TYPE_BLOCK_DEFINITIONS,
  registerTypeBlocks,
  PRIMITIVE_TYPE_OPTIONS,
} from './index';

describe('Phase 4.1 - Task 1.1: Type Annotations & Type Specifiers Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerTypeBlocks();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
  });

  it('should define all 5 core type annotation blocks in schema definitions', () => {
    expect(TYPE_BLOCK_DEFINITIONS.length).toBe(5);
    const types = TYPE_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('type_primitive');
    expect(types).toContain('type_array_of');
    expect(types).toContain('type_map_of');
    expect(types).toContain('type_custom');
    expect(types).toContain('type_nullable');
  });

  it('should register primitive dropdown options matching specification', () => {
    const primitiveBlockDef = TYPE_BLOCK_DEFINITIONS.find((d) => d.type === 'type_primitive');
    expect(primitiveBlockDef).toBeDefined();

    const options = PRIMITIVE_TYPE_OPTIONS.map(([_, val]) => val);
    expect(options).toContain('INT');
    expect(options).toContain('FLOAT');
    expect(options).toContain('STRING');
    expect(options).toContain('BOOL');
    expect(options).toContain('DYNAMIC');
    expect(options).toContain('VOID');
    expect(options).toContain('ARRAY');
    expect(options).toContain('MAP');
    expect(options).toContain('CUSTOM');
  });

  it('should instantiate type_primitive block and set field values', () => {
    const block = workspace.newBlock('type_primitive');
    expect(block.type).toBe('type_primitive');
    expect(block.outputConnection).not.toBeNull();
    expect(block.outputConnection?.getCheck()).toContain('Type');

    const field = block.getField('TYPE') as Blockly.FieldDropdown;
    expect(field).toBeDefined();
    field.setValue('INT');
    expect(field.getValue()).toBe('INT');
  });

  it('should instantiate and nest type_array_of parameterized types', () => {
    const arrayBlock = workspace.newBlock('type_array_of');
    const elemTypeBlock = workspace.newBlock('type_primitive');

    const input = arrayBlock.getInput('ELEMENT_TYPE');
    expect(input).toBeDefined();
    expect(input?.connection).not.toBeNull();

    // Connect inner primitive type to Array<T>
    input?.connection?.connect(elemTypeBlock.outputConnection!);
    expect(arrayBlock.getChildren(false).length).toBe(1);
    expect(arrayBlock.getChildren(false)[0]?.type).toBe('type_primitive');
  });

  it('should instantiate and nest type_map_of key-value parameterized types', () => {
    const mapBlock = workspace.newBlock('type_map_of');
    const keyTypeBlock = workspace.newBlock('type_primitive');
    const valTypeBlock = workspace.newBlock('type_primitive');

    const keyInput = mapBlock.getInput('KEY_TYPE');
    const valInput = mapBlock.getInput('VALUE_TYPE');

    expect(keyInput).toBeDefined();
    expect(valInput).toBeDefined();

    keyInput?.connection?.connect(keyTypeBlock.outputConnection!);
    valInput?.connection?.connect(valTypeBlock.outputConnection!);

    expect(mapBlock.getChildren(false).length).toBe(2);
  });

  it('should instantiate custom class/interface type block and configure custom type name', () => {
    const customBlock = workspace.newBlock('type_custom');
    expect(customBlock.type).toBe('type_custom');

    const nameField = customBlock.getField('TYPE_NAME') as Blockly.FieldTextInput;
    expect(nameField).toBeDefined();
    nameField.setValue('PlayerEntity');
    expect(nameField.getValue()).toBe('PlayerEntity');
  });

  it('should instantiate nullable type modifier wrapper (?Type / Null<T>)', () => {
    const nullableBlock = workspace.newBlock('type_nullable');
    const innerCustomType = workspace.newBlock('type_custom');

    const innerInput = nullableBlock.getInput('INNER_TYPE');
    expect(innerInput).toBeDefined();

    innerInput?.connection?.connect(innerCustomType.outputConnection!);
    expect(nullableBlock.getChildren(false).length).toBe(1);
    expect(nullableBlock.getChildren(false)[0]?.type).toBe('type_custom');
  });
});
