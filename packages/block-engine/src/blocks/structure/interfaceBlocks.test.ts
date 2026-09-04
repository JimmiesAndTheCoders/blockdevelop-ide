import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  INTERFACE_BLOCK_DEFINITIONS,
  VALID_INTERFACE_MEMBER_TYPES,
  validateInterfaceMembers,
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
  if (b.warnings_ && typeof b.warnings_ === 'object') {
    const vals = Object.values(b.warnings_ as Record<string, string>);
    if (vals.length > 0) return vals.join(' ');
  }
  return null;
}

describe('Phase 4.2 - Section 4: Interface & Contract Definition Suite', () => {
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

  describe('1. Interface Block Registrations & Fields', () => {
    it('should define interface_declaration, interface_method_signature, and interface_property_signature blocks', () => {
      expect(INTERFACE_BLOCK_DEFINITIONS.length).toBe(3);
      const types = INTERFACE_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('interface_declaration');
      expect(types).toContain('interface_method_signature');
      expect(types).toContain('interface_property_signature');
    });

    it('should instantiate interface_declaration and configure access and inheritance', () => {
      const block = workspace.newBlock('interface_declaration');
      expect(block.type).toBe('interface_declaration');

      const accessField = block.getField('ACCESS') as Blockly.FieldDropdown;
      const nameField = block.getField('INTERFACE_NAME') as Blockly.FieldTextInput;
      const extendsField = block.getField('EXTENDS_INTERFACES') as Blockly.FieldTextInput;

      accessField.setValue('PUBLIC');
      nameField.setValue('IDamageable');
      extendsField.setValue('IEntity, IUpdatable');

      expect(accessField.getValue()).toBe('PUBLIC');
      expect(nameField.getValue()).toBe('IDamageable');
      expect(extendsField.getValue()).toBe('IEntity, IUpdatable');
      expect(block.getInput('MEMBERS')).toBeDefined();
    });

    it('should instantiate interface_method_signature and connect parameters and return type', () => {
      const methodSig = workspace.newBlock('interface_method_signature');
      expect(methodSig.type).toBe('interface_method_signature');
      expect(methodSig.previousConnection).not.toBeNull();
      expect(methodSig.nextConnection).not.toBeNull();

      const nameField = methodSig.getField('METHOD_NAME') as Blockly.FieldTextInput;
      nameField.setValue('takeDamage');
      expect(nameField.getValue()).toBe('takeDamage');

      const param = workspace.newBlock('function_param_item');
      const retType = workspace.newBlock('type_primitive');
      (retType.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');

      methodSig.getInput('PARAMS')?.connection?.connect(param.previousConnection!);
      methodSig.getInput('RETURN_TYPE')?.connection?.connect(retType.outputConnection!);

      expect(methodSig.getChildren(false).length).toBe(2);
    });

    it('should instantiate interface_property_signature and configure accessors', () => {
      const propSig = workspace.newBlock('interface_property_signature');
      expect(propSig.type).toBe('interface_property_signature');

      const nameField = propSig.getField('PROPERTY_NAME') as Blockly.FieldTextInput;
      const readField = propSig.getField('READ_ACCESS') as Blockly.FieldDropdown;
      const writeField = propSig.getField('WRITE_ACCESS') as Blockly.FieldDropdown;

      nameField.setValue('maxHealth');
      readField.setValue('DEFAULT');
      writeField.setValue('NULL'); // Read-only

      expect(nameField.getValue()).toBe('maxHealth');
      expect(readField.getValue()).toBe('DEFAULT');
      expect(writeField.getValue()).toBe('NULL');

      const propType = workspace.newBlock('type_primitive');
      (propType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      propSig.getInput('PROPERTY_TYPE')?.connection?.connect(propType.outputConnection!);

      expect(propSig.getChildren(false).length).toBe(1);
    });
  });

  describe('2. Interface Member Constraints & Validation', () => {
    it('should allow valid signature blocks inside interface and maintain valid status', () => {
      const interfaceBlock = workspace.newBlock('interface_declaration');
      const methodSig = workspace.newBlock('interface_method_signature');
      const propSig = workspace.newBlock('interface_property_signature');

      interfaceBlock.getInput('MEMBERS')?.connection?.connect(methodSig.previousConnection!);
      methodSig.nextConnection?.connect(propSig.previousConnection!);

      const result = validateInterfaceMembers(interfaceBlock);

      expect(result.valid).toBe(true);
      expect(result.invalidBlockTypes).toEqual([]);
      expect(getBlockWarningText(interfaceBlock)).toBeNull();
    });

    it('should flag warning when a concrete function body or constructor is placed inside an interface', () => {
      const interfaceBlock = workspace.newBlock('interface_declaration');
      const invalidConcreteMethod = workspace.newBlock('function_def_typed');

      interfaceBlock.getInput('MEMBERS')?.connection?.connect(invalidConcreteMethod.previousConnection!);
      const result = validateInterfaceMembers(interfaceBlock);

      expect(result.valid).toBe(false);
      expect(result.invalidBlockTypes).toContain('function_def_typed');
      expect(result.error).toContain('Interface contains invalid concrete members');

      const interfaceWarning = getBlockWarningText(interfaceBlock);
      const methodWarning = getBlockWarningText(invalidConcreteMethod);

      expect(interfaceWarning).toContain('Interface contains invalid concrete members');
      expect(methodWarning).toContain('not allowed in an interface');
    });

    it('should validate allowed interface member type catalogue', () => {
      expect(VALID_INTERFACE_MEMBER_TYPES.has('interface_method_signature')).toBe(true);
      expect(VALID_INTERFACE_MEMBER_TYPES.has('interface_property_signature')).toBe(true);
      expect(VALID_INTERFACE_MEMBER_TYPES.has('function_def_typed')).toBe(false);
      expect(VALID_INTERFACE_MEMBER_TYPES.has('class_constructor')).toBe(false);
    });
  });
});
