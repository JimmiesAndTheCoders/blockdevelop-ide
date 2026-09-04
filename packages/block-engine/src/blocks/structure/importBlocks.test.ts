import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  IMPORT_BLOCK_DEFINITIONS,
  IMPORT_KIND_OPTIONS,
  isValidImportPath,
} from './index';

describe('Phase 4.1 - Task 4.3: Import & Dependency Statements Suite', () => {
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

  it('should define all 3 import blocks in schema definitions', () => {
    expect(IMPORT_BLOCK_DEFINITIONS.length).toBe(3);
    const types = IMPORT_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('import_statement');
    expect(types).toContain('import_wildcard');
    expect(types).toContain('import_alias');
  });

  it('should expose import kind dropdown options', () => {
    const kinds = IMPORT_KIND_OPTIONS.map(([_, v]) => v);
    expect(kinds).toEqual(['SYMBOL', 'WILDCARD', 'ALIAS']);
  });

  it('should validate valid and invalid import paths', () => {
    expect(isValidImportPath('com.example.Player')).toBe(true);
    expect(isValidImportPath('haxe.ds.Vector')).toBe(true);
    expect(isValidImportPath('com.example.utils.*')).toBe(true);
    expect(isValidImportPath('Math')).toBe(true);
    expect(isValidImportPath('')).toBe(false);
    expect(isValidImportPath('com..example')).toBe(false);
  });

  it('should instantiate import_statement and configure kind, module path, and alias', () => {
    const importBlock = workspace.newBlock('import_statement');
    expect(importBlock.type).toBe('import_statement');
    expect(importBlock.previousConnection).not.toBeNull();
    expect(importBlock.nextConnection).not.toBeNull();

    const kindField = importBlock.getField('KIND') as Blockly.FieldDropdown;
    const pathField = importBlock.getField('MODULE_PATH') as Blockly.FieldTextInput;
    const aliasField = importBlock.getField('ALIAS') as Blockly.FieldTextInput;

    kindField.setValue('ALIAS');
    pathField.setValue('haxe.ds.Vector');
    aliasField.setValue('FastVector');

    expect(kindField.getValue()).toBe('ALIAS');
    expect(pathField.getValue()).toBe('haxe.ds.Vector');
    expect(aliasField.getValue()).toBe('FastVector');
  });

  it('should instantiate import_wildcard and import_alias blocks', () => {
    const wildcardBlock = workspace.newBlock('import_wildcard');
    const aliasBlock = workspace.newBlock('import_alias');

    expect(wildcardBlock.previousConnection).not.toBeNull();
    expect(aliasBlock.previousConnection).not.toBeNull();

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
