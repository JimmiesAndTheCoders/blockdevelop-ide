import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  ENUM_BLOCK_DEFINITIONS,
  VALID_ENUM_MEMBER_TYPES,
  validateEnumMembers,
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

describe('Phase 4.2 - Section 5: Enum & Algebraic Data Type Suite', () => {
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

  describe('1. Enum Block Registrations & Fields', () => {
    it('should define all 5 enum declaration, constructor, reference, and pattern match blocks', () => {
      expect(ENUM_BLOCK_DEFINITIONS.length).toBe(5);
      const types = ENUM_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('enum_declaration');
      expect(types).toContain('enum_constructor_item');
      expect(types).toContain('enum_constructor_parameterized');
      expect(types).toContain('enum_value_reference');
      expect(types).toContain('enum_pattern_match');
    });

    it('should instantiate enum_declaration and configure access and name', () => {
      const enumBlock = workspace.newBlock('enum_declaration');
      expect(enumBlock.type).toBe('enum_declaration');

      const accessField = enumBlock.getField('ACCESS') as Blockly.FieldDropdown;
      const nameField = enumBlock.getField('ENUM_NAME') as Blockly.FieldTextInput;

      accessField.setValue('PUBLIC');
      nameField.setValue('Direction');

      expect(accessField.getValue()).toBe('PUBLIC');
      expect(nameField.getValue()).toBe('Direction');
      expect(enumBlock.getInput('VARIANTS')).toBeDefined();
    });

    it('should instantiate parameterized enum constructor (e.g. Color(r: Int, g: Int, b: Int))', () => {
      const paramCase = workspace.newBlock('enum_constructor_parameterized');
      expect(paramCase.type).toBe('enum_constructor_parameterized');

      const nameField = paramCase.getField('VARIANT_NAME') as Blockly.FieldTextInput;
      nameField.setValue('Rgb');
      expect(nameField.getValue()).toBe('Rgb');

      const paramR = workspace.newBlock('function_param_item');
      (paramR.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('r');

      paramCase.getInput('PARAMS')?.connection?.connect(paramR.previousConnection!);
      expect(paramCase.getChildren(false).length).toBe(1);
    });

    it('should instantiate enum_value_reference expression and connect arguments', () => {
      const refBlock = workspace.newBlock('enum_value_reference');
      expect(refBlock.type).toBe('enum_value_reference');
      expect(refBlock.outputConnection).not.toBeNull();

      (refBlock.getField('ENUM_NAME') as Blockly.FieldTextInput).setValue('Color');
      (refBlock.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('Rgb');

      const arg0 = workspace.newBlock('math_number');
      const arg1 = workspace.newBlock('math_number');

      refBlock.getInput('ARG0')?.connection?.connect(arg0.outputConnection!);
      refBlock.getInput('ARG1')?.connection?.connect(arg1.outputConnection!);

      expect(refBlock.getChildren(false).length).toBe(2);
    });

    it('should instantiate enum_pattern_match block with target and bindings', () => {
      const matchBlock = workspace.newBlock('enum_pattern_match');
      expect(matchBlock.type).toBe('enum_pattern_match');
      expect(matchBlock.previousConnection).not.toBeNull();
      expect(matchBlock.nextConnection).not.toBeNull();

      const caseField = matchBlock.getField('MATCH_CASE') as Blockly.FieldTextInput;
      const bindingsField = matchBlock.getField('BINDINGS') as Blockly.FieldTextInput;

      caseField.setValue('Rgb');
      bindingsField.setValue('r, g, b');

      expect(caseField.getValue()).toBe('Rgb');
      expect(bindingsField.getValue()).toBe('r, g, b');
      expect(matchBlock.getInput('DO')).toBeDefined();
      expect(matchBlock.getInput('DEFAULT')).toBeDefined();
    });
  });

  describe('2. Enum Member Constraints & Validation', () => {
    it('should allow both scalar and parameterized constructors inside enum and maintain valid status', () => {
      const enumBlock = workspace.newBlock('enum_declaration');
      const caseScalar = workspace.newBlock('enum_constructor_item');
      const caseParam = workspace.newBlock('enum_constructor_parameterized');

      enumBlock.getInput('VARIANTS')?.connection?.connect(caseScalar.previousConnection!);
      caseScalar.nextConnection?.connect(caseParam.previousConnection!);

      const result = validateEnumMembers(enumBlock);

      expect(result.valid).toBe(true);
      expect(result.invalidBlockTypes).toEqual([]);
      expect(getBlockWarningText(enumBlock)).toBeNull();
    });

    it('should flag warning when non-enum blocks are attached inside enum container', () => {
      const enumBlock = workspace.newBlock('enum_declaration');
      const invalidMethod = workspace.newBlock('function_def_typed');

      enumBlock.getInput('VARIANTS')?.connection?.connect(invalidMethod.previousConnection!);
      const result = validateEnumMembers(enumBlock);

      expect(result.valid).toBe(false);
      expect(result.invalidBlockTypes).toContain('function_def_typed');

      const enumWarning = getBlockWarningText(enumBlock);
      const methodWarning = getBlockWarningText(invalidMethod);

      expect(enumWarning).toContain('Enum contains invalid member blocks');
      expect(methodWarning).toContain('not allowed inside an enum');
    });

    it('should validate allowed enum member type catalogue', () => {
      expect(VALID_ENUM_MEMBER_TYPES.has('enum_constructor_item')).toBe(true);
      expect(VALID_ENUM_MEMBER_TYPES.has('enum_constructor_parameterized')).toBe(true);
      expect(VALID_ENUM_MEMBER_TYPES.has('function_def_typed')).toBe(false);
      expect(VALID_ENUM_MEMBER_TYPES.has('class_constructor')).toBe(false);
    });
  });
});
