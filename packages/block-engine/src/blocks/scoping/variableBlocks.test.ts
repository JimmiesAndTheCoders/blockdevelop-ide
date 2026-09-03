import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  SCOPED_VARIABLE_BLOCK_DEFINITIONS,
  ACCESS_MODIFIER_OPTIONS,
  SCOPE_LEVEL_OPTIONS,
  VARIABLE_KIND_OPTIONS,
  VARIABLE_TARGET_SCOPE_OPTIONS,
  ASSIGNMENT_OPERATOR_OPTIONS,
  UNARY_MUTATION_OPERATOR_OPTIONS,
  UNARY_MUTATION_POSITION_OPTIONS,
} from './index';

describe('Phase 4.1 - Task 1.2 & 1.3: Variable Declaration & Mutation Suite', () => {
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

  it('should define all 6 variable declaration and mutation blocks in schema definitions', () => {
    expect(SCOPED_VARIABLE_BLOCK_DEFINITIONS.length).toBe(6);
    const types = SCOPED_VARIABLE_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('variable_declare_typed');
    expect(types).toContain('variable_declare_inferred');
    expect(types).toContain('variable_declare_local');
    expect(types).toContain('variable_get_scoped_typed');
    expect(types).toContain('variable_assign_op');
    expect(types).toContain('variable_increment_decrement');
  });

  it('should expose complete assignment operators, unary operators, and positions', () => {
    const assignOps = ASSIGNMENT_OPERATOR_OPTIONS.map(([_, v]) => v);
    expect(assignOps).toEqual([
      'ASSIGN',
      'ADD_ASSIGN',
      'SUB_ASSIGN',
      'MUL_ASSIGN',
      'DIV_ASSIGN',
      'MOD_ASSIGN',
    ]);

    const unaryOps = UNARY_MUTATION_OPERATOR_OPTIONS.map(([_, v]) => v);
    expect(unaryOps).toEqual(['INC', 'DEC']);

    const unaryPos = UNARY_MUTATION_POSITION_OPTIONS.map(([_, v]) => v);
    expect(unaryPos).toEqual(['POSTFIX', 'PREFIX']);

    const accessValues = ACCESS_MODIFIER_OPTIONS.map(([_, v]) => v);
    expect(accessValues).toEqual(['PUBLIC', 'PRIVATE', 'PROTECTED', 'INTERNAL']);

    const scopeValues = SCOPE_LEVEL_OPTIONS.map(([_, v]) => v);
    expect(scopeValues).toEqual(['LOCAL', 'FIELD', 'STATIC', 'GLOBAL']);

    const kindValues = VARIABLE_KIND_OPTIONS.map(([_, v]) => v);
    expect(kindValues).toEqual(['VAR', 'LET', 'CONST', 'FINAL']);

    const targetScopeValues = VARIABLE_TARGET_SCOPE_OPTIONS.map(([_, v]) => v);
    expect(targetScopeValues).toEqual(['LOCAL', 'THIS', 'SUPER', 'STATIC', 'GLOBAL']);
  });

  it('should instantiate variable_assign_op and configure scope resolution and operators', () => {
    const block = workspace.newBlock('variable_assign_op');
    expect(block.type).toBe('variable_assign_op');
    expect(block.previousConnection).not.toBeNull();
    expect(block.nextConnection).not.toBeNull();

    const scopeField = block.getField('TARGET_SCOPE') as Blockly.FieldDropdown;
    const nameField = block.getField('VAR_NAME') as Blockly.FieldTextInput;
    const opField = block.getField('OPERATOR') as Blockly.FieldDropdown;

    scopeField.setValue('THIS');
    nameField.setValue('playerHealth');
    opField.setValue('SUB_ASSIGN');

    expect(scopeField.getValue()).toBe('THIS');
    expect(nameField.getValue()).toBe('playerHealth');
    expect(opField.getValue()).toBe('SUB_ASSIGN');

    // Connect value input (now math_number is properly registered)
    const numBlock = workspace.newBlock('math_number');
    const valInput = block.getInput('VALUE');
    valInput?.connection?.connect(numBlock.outputConnection!);

    expect(block.getChildren(false).length).toBe(1);
  });

  it('should instantiate variable_increment_decrement with prefix/postfix and scope targets', () => {
    const block = workspace.newBlock('variable_increment_decrement');
    expect(block.type).toBe('variable_increment_decrement');
    expect(block.previousConnection).not.toBeNull();
    expect(block.nextConnection).not.toBeNull();

    const posField = block.getField('POSITION') as Blockly.FieldDropdown;
    const opField = block.getField('OPERATOR') as Blockly.FieldDropdown;
    const scopeField = block.getField('TARGET_SCOPE') as Blockly.FieldDropdown;
    const nameField = block.getField('VAR_NAME') as Blockly.FieldTextInput;

    posField.setValue('PREFIX');
    opField.setValue('INC');
    scopeField.setValue('SUPER');
    nameField.setValue('stepCounter');

    expect(posField.getValue()).toBe('PREFIX');
    expect(opField.getValue()).toBe('INC');
    expect(scopeField.getValue()).toBe('SUPER');
    expect(nameField.getValue()).toBe('stepCounter');
  });

  it('should instantiate and configure variable_declare_typed block', () => {
    const block = workspace.newBlock('variable_declare_typed');
    expect(block.type).toBe('variable_declare_typed');

    const accessField = block.getField('ACCESS') as Blockly.FieldDropdown;
    const scopeField = block.getField('SCOPE') as Blockly.FieldDropdown;
    const kindField = block.getField('KIND') as Blockly.FieldDropdown;
    const nameField = block.getField('VAR_NAME') as Blockly.FieldTextInput;

    accessField.setValue('PUBLIC');
    scopeField.setValue('STATIC');
    kindField.setValue('FINAL');
    nameField.setValue('GRAVITY');

    expect(accessField.getValue()).toBe('PUBLIC');
    expect(scopeField.getValue()).toBe('STATIC');
    expect(kindField.getValue()).toBe('FINAL');
    expect(nameField.getValue()).toBe('GRAVITY');
  });
});
