import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  IMPORT_BLOCK_DEFINITIONS,
  IMPORT_KIND_OPTIONS,
  isValidImportPath,
} from './index';

describe('Phase 4.2 - Section 2.2: Import & Dependency Statements Suite', () => {
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

  describe('1. Block Registrations & Instantiations', () => {
    it('should define all 5 import and using blocks in schema definitions', () => {
      expect(IMPORT_BLOCK_DEFINITIONS.length).toBe(5);
      const types = IMPORT_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('import_type');
      expect(types).toContain('import_wildcard');
      expect(types).toContain('import_alias');
      expect(types).toContain('using_mixin');
      expect(types).toContain('import_statement');
    });

    it('should expose import kind dropdown options', () => {
      const kinds = IMPORT_KIND_OPTIONS.map(([_, v]) => v);
      expect(kinds).toEqual(['SYMBOL', 'WILDCARD', 'ALIAS']);
    });

    it('should instantiate import_type statement block', () => {
      const block = workspace.newBlock('import_type');
      expect(block.type).toBe('import_type');
      expect(block.previousConnection).not.toBeNull();
      expect(block.nextConnection).not.toBeNull();

      const pathField = block.getField('MODULE_PATH') as Blockly.FieldTextInput;
      expect(pathField.getValue()).toBe('haxe.ds.Vector');
    });

    it('should instantiate using_mixin extension block', () => {
      const block = workspace.newBlock('using_mixin');
      expect(block.type).toBe('using_mixin');
      expect(block.previousConnection).not.toBeNull();
      expect(block.nextConnection).not.toBeNull();

      const pathField = block.getField('MODULE_PATH') as Blockly.FieldTextInput;
      pathField.setValue('StringTools');
      expect(pathField.getValue()).toBe('StringTools');
    });

    it('should chain import and using statements sequentially', () => {
      const imp1 = workspace.newBlock('import_type');
      const imp2 = workspace.newBlock('import_wildcard');
      const usingBlock = workspace.newBlock('using_mixin');

      imp1.nextConnection?.connect(imp2.previousConnection!);
      imp2.nextConnection?.connect(usingBlock.previousConnection!);

      expect(imp1.getChildren(false).length).toBe(1);
      expect(imp2.getChildren(false).length).toBe(1);
    });
  });

  describe('2. Import Path Validation & Sanitization', () => {
    it('should validate valid and wildcard import paths', () => {
      expect(isValidImportPath('com.example.Player')).toBe(true);
      expect(isValidImportPath('haxe.ds.Vector')).toBe(true);
      expect(isValidImportPath('com.example.utils.*')).toBe(true);
      expect(isValidImportPath('StringTools')).toBe(true);
    });

    it('should reject invalid import paths', () => {
      expect(isValidImportPath('')).toBe(false);
      expect(isValidImportPath('com..example')).toBe(false);
      expect(isValidImportPath('123.bad.start')).toBe(false);
    });

    it('should configure import_alias and import_wildcard field inputs', () => {
      const wildcardBlock = workspace.newBlock('import_wildcard');
      const aliasBlock = workspace.newBlock('import_alias');

      const wildcardPath = wildcardBlock.getField('PACKAGE_PATH') as Blockly.FieldTextInput;
      wildcardPath.setValue('com.example.events');
      expect(wildcardPath.getValue()).toBe('com.example.events');

      const aliasPath = aliasBlock.getField('MODULE_PATH') as Blockly.FieldTextInput;
      const aliasName = aliasBlock.getField('ALIAS') as Blockly.FieldTextInput;
      aliasPath.setValue('com.example.Sprite');
      aliasName.setValue('DisplaySprite');

      expect(aliasPath.getValue()).toBe('com.example.Sprite');
      expect(aliasName.getValue()).toBe('DisplaySprite');
    });
  });
});
