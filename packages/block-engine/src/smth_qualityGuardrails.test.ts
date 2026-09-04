import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from './blocks';
import {
  sanitizePackageNamespace,
  isValidPackageNamespace,
  isValidImportPath,
  validateWorkspacePackageStructure,
} from './blocks/structure';
import {
  serializeWorkspaceToJsonString,
  deserializeWorkspaceFromJsonString,
  serializeWorkspaceToXml,
  deserializeWorkspaceFromXml,
} from './serialization';

describe('Phase 4.1 Section 6 - Comprehensive Quality Guardrails & Unit Test Suite', () => {
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

  // ---------------------------------------------------------------------------
  // 1. Type Parsing and Scoping Rules Suite
  // ---------------------------------------------------------------------------
  describe('1. Type Parsing & Scoping Rules', () => {
    it('should correctly configure primitive type blocks', () => {
      const typeBlock = workspace.newBlock('type_primitive');
      const typeField = typeBlock.getField('TYPE') as Blockly.FieldDropdown;

      ['INT', 'FLOAT', 'STRING', 'BOOL', 'DYNAMIC', 'VOID'].forEach((primitiveVal) => {
        typeField.setValue(primitiveVal);
        expect(typeField.getValue()).toBe(primitiveVal);
      });
    });

    it('should support deep generic type nesting (e.g. Map<String, Array<Int>>)', () => {
      const mapType = workspace.newBlock('type_map_of');
      const keyType = workspace.newBlock('type_primitive');
      (keyType.getField('TYPE') as Blockly.FieldDropdown).setValue('STRING');

      const arrayType = workspace.newBlock('type_array_of');
      const elemType = workspace.newBlock('type_primitive');
      (elemType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');

      // Nest: Array<Int>
      arrayType.getInput('ELEMENT_TYPE')?.connection?.connect(elemType.outputConnection!);

      // Nest: Map<String, Array<Int>>
      mapType.getInput('KEY_TYPE')?.connection?.connect(keyType.outputConnection!);
      mapType.getInput('VALUE_TYPE')?.connection?.connect(arrayType.outputConnection!);

      expect(mapType.getChildren(false).length).toBe(2);
      expect(mapType.outputConnection?.getCheck()).toContain('Type');
    });

    it('should configure scoped typed variable declarations across all 4 scope levels', () => {
      const varBlock = workspace.newBlock('variable_declare_typed');
      const accessField = varBlock.getField('ACCESS') as Blockly.FieldDropdown;
      const scopeField = varBlock.getField('SCOPE') as Blockly.FieldDropdown;
      const kindField = varBlock.getField('KIND') as Blockly.FieldDropdown;
      const nameField = varBlock.getField('VAR_NAME') as Blockly.FieldTextInput;

      accessField.setValue('PRIVATE');
      scopeField.setValue('STATIC');
      kindField.setValue('CONST');
      nameField.setValue('MAX_RETRY_COUNT');

      const typeBlock = workspace.newBlock('type_primitive');
      (typeBlock.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');

      const valBlock = workspace.newBlock('math_number');
      (valBlock.getField('NUM') as Blockly.FieldNumber).setValue(5);

      varBlock.getInput('TYPE_ANNOTATION')?.connection?.connect(typeBlock.outputConnection!);
      varBlock.getInput('INITIAL_VALUE')?.connection?.connect(valBlock.outputConnection!);

      expect(accessField.getValue()).toBe('PRIVATE');
      expect(scopeField.getValue()).toBe('STATIC');
      expect(kindField.getValue()).toBe('CONST');
      expect(nameField.getValue()).toBe('MAX_RETRY_COUNT');
      expect(varBlock.getChildren(false).length).toBe(2);
    });

    it('should support scoped variable resolution (this.x, super.x, static Class.x, global.x)', () => {
      const getScopedBlock = workspace.newBlock('variable_get_scoped_typed');
      const targetScopeField = getScopedBlock.getField('TARGET_SCOPE') as Blockly.FieldDropdown;
      const varNameField = getScopedBlock.getField('VAR_NAME') as Blockly.FieldTextInput;

      ['LOCAL', 'THIS', 'SUPER', 'STATIC', 'GLOBAL'].forEach((scopeTarget) => {
        targetScopeField.setValue(scopeTarget);
        varNameField.setValue('playerSpeed');
        expect(targetScopeField.getValue()).toBe(scopeTarget);
        expect(varNameField.getValue()).toBe('playerSpeed');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 2. 1D and 2D Collection Manipulation Suite
  // ---------------------------------------------------------------------------
  describe('2. 1D & 2D Collection Manipulation & Indexing', () => {
    it('should build 1D array literal and query length and indices', () => {
      const arrayBlock = workspace.newBlock('array_create_with');
      const val1 = workspace.newBlock('text_literal');
      (val1.getField('TEXT') as Blockly.FieldTextInput).setValue('Alpha');

      const val2 = workspace.newBlock('text_literal');
      (val2.getField('TEXT') as Blockly.FieldTextInput).setValue('Beta');

      arrayBlock.getInput('ADD0')?.connection?.connect(val1.outputConnection!);
      arrayBlock.getInput('ADD1')?.connection?.connect(val2.outputConnection!);

      const lengthBlock = workspace.newBlock('array_length');
      lengthBlock.getInput('ARRAY')?.connection?.connect(arrayBlock.outputConnection!);

      expect(lengthBlock.outputConnection?.getCheck()).toContain('Number');
      expect(arrayBlock.getChildren(false).length).toBe(2);
    });

    it('should configure stack and queue operations (push, pop, shift, unshift)', () => {
      const pushBlock = workspace.newBlock('array_push');
      const popBlock = workspace.newBlock('array_pop');
      const shiftBlock = workspace.newBlock('array_shift');
      const unshiftBlock = workspace.newBlock('array_unshift');

      expect(pushBlock.previousConnection).not.toBeNull();
      expect(popBlock.outputConnection).not.toBeNull();
      expect(shiftBlock.outputConnection).not.toBeNull();
      expect(unshiftBlock.previousConnection).not.toBeNull();
    });

    it('should initialize 2D grid matrix and read/write cell coordinates', () => {
      const matrixCreate = workspace.newBlock('matrix_create_2d');
      const rows = workspace.newBlock('math_number');
      const cols = workspace.newBlock('math_number');
      const fillVal = workspace.newBlock('math_number');

      (rows.getField('NUM') as Blockly.FieldNumber).setValue(10);
      (cols.getField('NUM') as Blockly.FieldNumber).setValue(10);
      (fillVal.getField('NUM') as Blockly.FieldNumber).setValue(0);

      matrixCreate.getInput('ROWS')?.connection?.connect(rows.outputConnection!);
      matrixCreate.getInput('COLS')?.connection?.connect(cols.outputConnection!);
      matrixCreate.getInput('INITIAL_VALUE')?.connection?.connect(fillVal.outputConnection!);

      // Set cell block (row: 2, col: 4, value: 99)
      const matrixSet = workspace.newBlock('matrix_set_2d');
      const rIdx = workspace.newBlock('math_number');
      const cIdx = workspace.newBlock('math_number');
      const valCell = workspace.newBlock('math_number');

      (rIdx.getField('NUM') as Blockly.FieldNumber).setValue(2);
      (cIdx.getField('NUM') as Blockly.FieldNumber).setValue(4);
      (valCell.getField('NUM') as Blockly.FieldNumber).setValue(99);

      matrixSet.getInput('ROW')?.connection?.connect(rIdx.outputConnection!);
      matrixSet.getInput('COL')?.connection?.connect(cIdx.outputConnection!);
      matrixSet.getInput('VALUE')?.connection?.connect(valCell.outputConnection!);

      expect(matrixCreate.getChildren(false).length).toBe(3);
      expect(matrixSet.getChildren(false).length).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Function Signature and Parameter Default Value Suite
  // ---------------------------------------------------------------------------
  describe('3. Function Signature & Parameter Default Values', () => {
    it('should build a function with typed parameters and default values', () => {
      const funcBlock = workspace.newBlock('function_def_typed');
      (funcBlock.getField('NAME') as Blockly.FieldTextInput).setValue('calculateBonus');
      (funcBlock.getField('ACCESS') as Blockly.FieldDropdown).setValue('PUBLIC');
      (funcBlock.getField('MODIFIER') as Blockly.FieldDropdown).setValue('INLINE');

      // Parameter 1: multiplier: Float = 1.5
      const param1 = workspace.newBlock('function_param_item');
      (param1.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('multiplier');

      const p1Type = workspace.newBlock('type_primitive');
      (p1Type.getField('TYPE') as Blockly.FieldDropdown).setValue('FLOAT');

      const p1Default = workspace.newBlock('math_number');
      (p1Default.getField('NUM') as Blockly.FieldNumber).setValue(1.5);

      param1.getInput('PARAM_TYPE')?.connection?.connect(p1Type.outputConnection!);
      param1.getInput('DEFAULT_VALUE')?.connection?.connect(p1Default.outputConnection!);

      // Attach parameter to function
      funcBlock.getInput('PARAMS')?.connection?.connect(param1.previousConnection!);

      // Return type: Float
      const retType = workspace.newBlock('type_primitive');
      (retType.getField('TYPE') as Blockly.FieldDropdown).setValue('FLOAT');
      funcBlock.getInput('RETURN_TYPE')?.connection?.connect(retType.outputConnection!);

      expect(funcBlock.getChildren(false).length).toBe(2);
    });

    it('should support return value and bare return statements', () => {
      const retVal = workspace.newBlock('return_value');
      const retBare = workspace.newBlock('return_bare');

      expect(retVal.previousConnection).not.toBeNull();
      expect(retVal.nextConnection).toBeNull(); // Return is terminal in statement flow
      expect(retBare.previousConnection).not.toBeNull();
      expect(retBare.nextConnection).toBeNull();
    });

    it('should configure instance and static method calls with arguments', () => {
      const instanceCall = workspace.newBlock('method_call_instance');
      (instanceCall.getField('METHOD') as Blockly.FieldTextInput).setValue('setHealth');

      const staticCall = workspace.newBlock('method_call_static');
      (staticCall.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('MathUtil');
      (staticCall.getField('METHOD') as Blockly.FieldTextInput).setValue('clamp');

      expect(instanceCall.outputConnection).not.toBeNull();
      expect(staticCall.outputConnection).not.toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Class Wrapper and Package Declaration Structure Suite
  // ---------------------------------------------------------------------------
  describe('4. Class Wrapper & Package Declaration Structure', () => {
    it('should sanitize package names and reject invalid identifiers', () => {
      expect(sanitizePackageNamespace('   com.game.entities   ')).toBe('com.game.entities');
      expect(sanitizePackageNamespace('com...game..')).toBe('com.game');
      expect(isValidPackageNamespace('com.game.entities')).toBe(true);
      expect(isValidPackageNamespace('')).toBe(true);
      expect(isValidPackageNamespace('123.bad.pkg')).toBe(false);
    });

    it('should enforce singleton package declaration per file', () => {
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);

      const pkg1 = workspace.newBlock('package_declare');
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);

      workspace.newBlock('package_declare');
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(false);

      pkg1.dispose(false);
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);
    });

    it('should configure class inheritance, interface implementation, and constructor binding', () => {
      const classBlock = workspace.newBlock('class_wrapper');
      (classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Warrior');
      (classBlock.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('Player');
      (classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput).setValue(
        'IAttacker, IDamageable',
      );

      // Constructor with parameter
      const ctorBlock = workspace.newBlock('class_constructor');
      const paramBlock = workspace.newBlock('function_param_item');
      (paramBlock.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('initialHp');

      ctorBlock.getInput('PARAMS')?.connection?.connect(paramBlock.previousConnection!);
      classBlock.getInput('CONSTRUCTOR')?.connection?.connect(ctorBlock.previousConnection!);

      expect(classBlock.getChildren(false).length).toBe(1);
    });

    it('should validate wildcard and aliased import statements', () => {
      expect(isValidImportPath('com.example.utils.*')).toBe(true);
      expect(isValidImportPath('haxe.ds.Vector')).toBe(true);
      expect(isValidImportPath('')).toBe(false);

      const importWildcard = workspace.newBlock('import_wildcard');
      (importWildcard.getField('PACKAGE_PATH') as Blockly.FieldTextInput).setValue(
        'com.example.events',
      );

      const importAlias = workspace.newBlock('import_alias');
      (importAlias.getField('MODULE_PATH') as Blockly.FieldTextInput).setValue('haxe.ds.Vector');
      (importAlias.getField('ALIAS') as Blockly.FieldTextInput).setValue('FastVector');

      expect(importWildcard.previousConnection).not.toBeNull();
      expect(importAlias.previousConnection).not.toBeNull();
    });

    it('should roundtrip full class, package, and method structure through JSON & XML serialization', () => {
      // Create Package
      const pkg = workspace.newBlock('package_declare');
      (pkg.getField('PACKAGE_NAME') as Blockly.FieldTextInput).setValue('com.game.core');

      // Create Class
      const cls = workspace.newBlock('class_wrapper');
      (cls.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('GameSession');

      // Create Field
      const fld = workspace.newBlock('variable_declare_typed');
      (fld.getField('VAR_NAME') as Blockly.FieldTextInput).setValue('sessionTimer');
      cls.getInput('FIELDS')?.connection?.connect(fld.previousConnection!);

      // Serialize -> JSON -> Restore
      const json = serializeWorkspaceToJsonString(workspace);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      deserializeWorkspaceFromJsonString(workspace, json);
      expect(workspace.getAllBlocks(false).length).toBe(3);

      // Serialize -> XML -> Restore
      const xml = serializeWorkspaceToXml(workspace);
      workspace.clear();
      deserializeWorkspaceFromXml(workspace, xml);
      expect(workspace.getAllBlocks(false).length).toBe(3);
    });
  });
});
