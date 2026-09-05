import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  METHOD_BLOCK_DEFINITIONS,
  METHOD_MODIFIER_OPTIONS,
  validateMethodBody,
} from './index';

function getBlockWarningText(block: Blockly.Block): string | null {
  const b = block as unknown as Record<string, unknown>;

  if (typeof b.getWarningText === 'function') {
    const res = (b.getWarningText as () => string | null)();
    if (res) return String(res);
  }
  if (b.warning && typeof (b.warning as Record<string, unknown>).getText === 'function') {
    const res = ((b.warning as Record<string, unknown>).getText as () => string | null)();
    if (res) return String(res);
  }
  if (typeof b.warning === 'string') {
    return b.warning;
  }
  if (typeof b.warningText_ === 'string') {
    return b.warningText_;
  }
  if (typeof b.warningText === 'string') {
    return b.warningText;
  }
  return null;
}

describe('Phase 4.2 - Section 6.2: Member Method Blocks Suite', () => {
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

  describe('1. Method Block Registrations & Options', () => {
    it('should define class_method_declaration and method_param_item in schema definitions', () => {
      expect(METHOD_BLOCK_DEFINITIONS.length).toBe(2);
      const types = METHOD_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('class_method_declaration');
      expect(types).toContain('method_param_item');
    });

    it('should expose all 7 method modifiers', () => {
      const modifiers = METHOD_MODIFIER_OPTIONS.map(([_, v]) => v);
      expect(modifiers).toEqual(['NONE', 'OVERRIDE', 'STATIC', 'INLINE', 'STATIC_INLINE', 'ABSTRACT', 'DYNAMIC']);
    });
  });

  describe('2. Member Method Instantiation & Parameter List', () => {
    it('should instantiate class_method_declaration with access modifier, specifier, params, and return type', () => {
      const methodBlock = workspace.newBlock('class_method_declaration');
      expect(methodBlock.type).toBe('class_method_declaration');
      expect(methodBlock.previousConnection).not.toBeNull();
      expect(methodBlock.nextConnection).not.toBeNull();

      const accessField = methodBlock.getField('ACCESS') as Blockly.FieldDropdown;
      const modField = methodBlock.getField('MODIFIER') as Blockly.FieldDropdown;
      const nameField = methodBlock.getField('METHOD_NAME') as Blockly.FieldTextInput;

      accessField.setValue('PUBLIC');
      modField.setValue('OVERRIDE');
      nameField.setValue('updatePosition');

      expect(accessField.getValue()).toBe('PUBLIC');
      expect(modField.getValue()).toBe('OVERRIDE');
      expect(nameField.getValue()).toBe('updatePosition');

      const param = workspace.newBlock('method_param_item');
      (param.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('speed');
      (param.getField('IS_OPTIONAL') as Blockly.FieldCheckbox).setValue('TRUE');

      const retType = workspace.newBlock('type_primitive');
      (retType.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');

      methodBlock.getInput('PARAMS')?.connection?.connect(param.previousConnection!);
      methodBlock.getInput('RETURN_TYPE')?.connection?.connect(retType.outputConnection!);

      expect(methodBlock.getChildren(false).length).toBe(2);
    });

    it('should flag warning if an abstract method has a body attached', () => {
      const methodBlock = workspace.newBlock('class_method_declaration');
      (methodBlock.getField('MODIFIER') as Blockly.FieldDropdown).setValue('ABSTRACT');

      const bodyStmt = workspace.newBlock('return_bare');
      methodBlock.getInput('BODY')?.connection?.connect(bodyStmt.previousConnection!);

      const result = validateMethodBody(methodBlock);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Abstract methods cannot have an implementation body');
      expect(getBlockWarningText(methodBlock)).toContain('Abstract methods cannot have an implementation body');
    });
  });
});
