import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  CLASS_BLOCK_DEFINITIONS,
  CLASS_ACCESS_OPTIONS,
  CLASS_MODIFIER_OPTIONS,
  VALID_CLASS_FIELD_TYPES,
  VALID_CLASS_METHOD_TYPES,
  VALID_CLASS_CONSTRUCTOR_TYPES,
} from './index';

describe('Phase 4.1 - Task 4.2: Enclosing Class & Scope Definition Wrapper Suite', () => {
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

  it('should define class wrapper and constructor blocks in schema definitions', () => {
    expect(CLASS_BLOCK_DEFINITIONS.length).toBe(2);
    const types = CLASS_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('class_wrapper');
    expect(types).toContain('class_constructor');
  });

  it('should expose access and class modifier dropdown options', () => {
    const accessVals = CLASS_ACCESS_OPTIONS.map(([_, v]) => v);
    expect(accessVals).toEqual(['PUBLIC', 'PRIVATE', 'INTERNAL']);

    const modVals = CLASS_MODIFIER_OPTIONS.map(([_, v]) => v);
    expect(modVals).toEqual(['NONE', 'FINAL', 'ABSTRACT']);
  });

  it('should instantiate class_wrapper and configure inheritance and member slots', () => {
    const classBlock = workspace.newBlock('class_wrapper');
    expect(classBlock.type).toBe('class_wrapper');

    const accessField = classBlock.getField('ACCESS') as Blockly.FieldDropdown;
    const modField = classBlock.getField('MODIFIER') as Blockly.FieldDropdown;
    const nameField = classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput;
    const extendsField = classBlock.getField('EXTENDS_CLASS') as Blockly.FieldTextInput;
    const implementsField = classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput;

    accessField.setValue('PUBLIC');
    modField.setValue('FINAL');
    nameField.setValue('GamePlayer');
    extendsField.setValue('BaseEntity');
    implementsField.setValue('IDamageable, IUpdatable');

    expect(accessField.getValue()).toBe('PUBLIC');
    expect(modField.getValue()).toBe('FINAL');
    expect(nameField.getValue()).toBe('GamePlayer');
    expect(extendsField.getValue()).toBe('BaseEntity');
    expect(implementsField.getValue()).toBe('IDamageable, IUpdatable');

    // Check separate member input slots
    expect(classBlock.getInput('FIELDS')).toBeDefined();
    expect(classBlock.getInput('CONSTRUCTOR')).toBeDefined();
    expect(classBlock.getInput('METHODS')).toBeDefined();
  });

  it('should connect fields, constructor, and methods into class_wrapper slots', () => {
    const classBlock = workspace.newBlock('class_wrapper');
    const fieldBlock = workspace.newBlock('variable_declare_typed');
    const ctorBlock = workspace.newBlock('class_constructor');
    const methodBlock = workspace.newBlock('function_def_typed');

    classBlock.getInput('FIELDS')?.connection?.connect(fieldBlock.previousConnection!);
    classBlock.getInput('CONSTRUCTOR')?.connection?.connect(ctorBlock.previousConnection!);
    classBlock.getInput('METHODS')?.connection?.connect(methodBlock.previousConnection!);

    expect(classBlock.getChildren(false).length).toBe(3);
  });

  it('should validate allowed class member types', () => {
    expect(VALID_CLASS_FIELD_TYPES.has('variable_declare_typed')).toBe(true);
    expect(VALID_CLASS_METHOD_TYPES.has('function_def_typed')).toBe(true);
    expect(VALID_CLASS_CONSTRUCTOR_TYPES.has('class_constructor')).toBe(true);
  });
});
