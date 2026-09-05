import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  PROPERTY_BLOCK_DEFINITIONS,
  PROPERTY_SPECIFIER_OPTIONS,
  PROPERTY_ACCESS_MODE_OPTIONS,
} from './index';

describe('Phase 4.2 - Section 6.1: Advanced Member Property Blocks Suite', () => {
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

  describe('1. Property Block Registrations & Options', () => {
    it('should define class_property_declaration, property_getter_def, and property_setter_def', () => {
      expect(PROPERTY_BLOCK_DEFINITIONS.length).toBe(3);
      const types = PROPERTY_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('class_property_declaration');
      expect(types).toContain('property_getter_def');
      expect(types).toContain('property_setter_def');
    });

    it('should expose complete property specifiers', () => {
      const specifiers = PROPERTY_SPECIFIER_OPTIONS.map(([_, v]) => v);
      expect(specifiers).toEqual(['NONE', 'STATIC', 'INLINE', 'FINAL', 'STATIC_INLINE']);
    });

    it('should expose all 8 property accessor mode presets', () => {
      const modes = PROPERTY_ACCESS_MODE_OPTIONS.map(([_, v]) => v);
      expect(modes).toContain('DEFAULT_DEFAULT');
      expect(modes).toContain('DEFAULT_NULL');
      expect(modes).toContain('GET_SET');
      expect(modes).toContain('NEVER_NEVER');
      expect(modes).toContain('GET_NULL');
      expect(modes).toContain('GET_NEVER');
      expect(modes).toContain('DEFAULT_NEVER');
      expect(modes).toContain('NULL_DEFAULT');
    });
  });

  describe('2. Property Declaration & Accessor Blocks Instantiation', () => {
    it('should instantiate class_property_declaration and configure access, specifier, mode, type and initial value', () => {
      const propBlock = workspace.newBlock('class_property_declaration');
      expect(propBlock.type).toBe('class_property_declaration');
      expect(propBlock.previousConnection).not.toBeNull();
      expect(propBlock.nextConnection).not.toBeNull();

      const accessField = propBlock.getField('ACCESS') as Blockly.FieldDropdown;
      const specField = propBlock.getField('SPECIFIER') as Blockly.FieldDropdown;
      const nameField = propBlock.getField('PROP_NAME') as Blockly.FieldTextInput;
      const modeField = propBlock.getField('ACCESS_MODE') as Blockly.FieldDropdown;

      accessField.setValue('PUBLIC');
      specField.setValue('STATIC');
      nameField.setValue('score');
      modeField.setValue('DEFAULT_NULL'); // Readonly property

      expect(accessField.getValue()).toBe('PUBLIC');
      expect(specField.getValue()).toBe('STATIC');
      expect(nameField.getValue()).toBe('score');
      expect(modeField.getValue()).toBe('DEFAULT_NULL');

      const typeBlock = workspace.newBlock('type_primitive');
      (typeBlock.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');

      const valBlock = workspace.newBlock('math_number');
      (valBlock.getField('NUM') as Blockly.FieldNumber).setValue(100);

      propBlock.getInput('TYPE_ANNOTATION')?.connection?.connect(typeBlock.outputConnection!);
      propBlock.getInput('INITIAL_VALUE')?.connection?.connect(valBlock.outputConnection!);

      expect(propBlock.getChildren(false).length).toBe(2);
    });

    it('should instantiate property_getter_def and property_setter_def blocks', () => {
      const getterBlock = workspace.newBlock('property_getter_def');
      const setterBlock = workspace.newBlock('property_setter_def');

      (getterBlock.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('health');
      (setterBlock.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('health');
      (setterBlock.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('newHealth');

      expect((getterBlock.getField('PROP_NAME') as Blockly.FieldTextInput).getValue()).toBe('health');
      expect((setterBlock.getField('PROP_NAME') as Blockly.FieldTextInput).getValue()).toBe('health');
      expect((setterBlock.getField('PARAM_NAME') as Blockly.FieldTextInput).getValue()).toBe('newHealth');

      expect(getterBlock.getInput('BODY')).toBeDefined();
      expect(setterBlock.getInput('BODY')).toBeDefined();
    });
  });
});
