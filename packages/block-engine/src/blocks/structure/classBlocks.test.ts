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

describe('Phase 4.2 - Section 3: Class Definitions & Constructor System Suite', () => {
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

  describe('1. Class Block Schema & Options', () => {
    it('should define all 6 class declaration, constructor, and instantiation blocks', () => {
      expect(CLASS_BLOCK_DEFINITIONS.length).toBe(6);
      const types = CLASS_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('class_declaration');
      expect(types).toContain('class_wrapper');
      expect(types).toContain('class_constructor_declaration');
      expect(types).toContain('class_constructor');
      expect(types).toContain('super_constructor_call');
      expect(types).toContain('instance_instantiation');
    });

    it('should expose access modifiers (public, private, internal)', () => {
      const accessVals = CLASS_ACCESS_OPTIONS.map(([_, v]) => v);
      expect(accessVals).toEqual(['PUBLIC', 'PRIVATE', 'INTERNAL']);
    });

    it('should expose class specifiers (standard, final, abstract)', () => {
      const modVals = CLASS_MODIFIER_OPTIONS.map(([_, v]) => v);
      expect(modVals).toEqual(['NONE', 'FINAL', 'ABSTRACT']);
    });
  });

  describe('2. Constructor & Instantiation System', () => {
    it('should instantiate class_constructor_declaration with access modifier and params', () => {
      const ctorBlock = workspace.newBlock('class_constructor_declaration');
      expect(ctorBlock.type).toBe('class_constructor_declaration');
      expect(ctorBlock.previousConnection).not.toBeNull();
      expect(ctorBlock.nextConnection).not.toBeNull();

      const accessField = ctorBlock.getField('ACCESS') as Blockly.FieldDropdown;
      accessField.setValue('PUBLIC');
      expect(accessField.getValue()).toBe('PUBLIC');

      const paramBlock = workspace.newBlock('function_param_item');
      ctorBlock.getInput('PARAMS')?.connection?.connect(paramBlock.previousConnection!);
      expect(ctorBlock.getChildren(false).length).toBe(1);
    });

    it('should instantiate super_constructor_call and connect arguments', () => {
      const superBlock = workspace.newBlock('super_constructor_call');
      expect(superBlock.type).toBe('super_constructor_call');
      expect(superBlock.previousConnection).not.toBeNull();
      expect(superBlock.nextConnection).not.toBeNull();

      const arg0 = workspace.newBlock('math_number');
      superBlock.getInput('ARG0')?.connection?.connect(arg0.outputConnection!);
      expect(superBlock.getChildren(false).length).toBe(1);
    });

    it('should instantiate instance_instantiation expression (new ClassName)', () => {
      const newBlock = workspace.newBlock('instance_instantiation');
      expect(newBlock.type).toBe('instance_instantiation');
      expect(newBlock.outputConnection).not.toBeNull();

      const classField = newBlock.getField('CLASS_NAME') as Blockly.FieldTextInput;
      classField.setValue('GameEntity');
      expect(classField.getValue()).toBe('GameEntity');

      const arg0 = workspace.newBlock('math_number');
      newBlock.getInput('ARG0')?.connection?.connect(arg0.outputConnection!);
      expect(newBlock.getChildren(false).length).toBe(1);
    });

    it('should validate allowed class member type sets', () => {
      expect(VALID_CLASS_FIELD_TYPES.has('variable_declare_typed')).toBe(true);
      expect(VALID_CLASS_METHOD_TYPES.has('function_def_typed')).toBe(true);
      expect(VALID_CLASS_CONSTRUCTOR_TYPES.has('class_constructor')).toBe(true);
      expect(VALID_CLASS_CONSTRUCTOR_TYPES.has('class_constructor_declaration')).toBe(true);
    });
  });
});
