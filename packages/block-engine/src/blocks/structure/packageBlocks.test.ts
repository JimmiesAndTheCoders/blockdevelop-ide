import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  PACKAGE_BLOCK_DEFINITIONS,
  sanitizePackageNamespace,
  isValidPackageNamespace,
  validateWorkspacePackageStructure,
} from './index';

describe('Phase 4.1 - Task 4.1: Package & Namespace Declaration Suite', () => {
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

  it('should define all package blocks in schema definitions', () => {
    expect(PACKAGE_BLOCK_DEFINITIONS.length).toBe(2);
    const types = PACKAGE_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('package_declare');
    expect(types).toContain('package_declare_header');
  });

  it('should sanitize package names by removing illegal characters and formatting dots', () => {
    expect(sanitizePackageNamespace('  com.example.game  ')).toBe('com.example.game');
    expect(sanitizePackageNamespace('com.example...game..')).toBe('com.example.game');
    expect(sanitizePackageNamespace('com.@!#example.$.game')).toBe('com.example.game');
    expect(sanitizePackageNamespace('.leading.and.trailing.')).toBe('leading.and.trailing');
  });

  it('should validate valid and invalid package namespace patterns', () => {
    expect(isValidPackageNamespace('com.example.app')).toBe(true);
    expect(isValidPackageNamespace('main')).toBe(true);
    expect(isValidPackageNamespace('')).toBe(true);
    expect(isValidPackageNamespace('com..example')).toBe(false);
    expect(isValidPackageNamespace('123com.example')).toBe(false);
  });

  it('should instantiate package_declare wrapper block with name and body input', () => {
    const pkgBlock = workspace.newBlock('package_declare');
    expect(pkgBlock.type).toBe('package_declare');

    const nameField = pkgBlock.getField('PACKAGE_NAME') as Blockly.FieldTextInput;
    nameField.setValue('net.blockdevelop.demo');
    expect(nameField.getValue()).toBe('net.blockdevelop.demo');

    const bodyInput = pkgBlock.getInput('BODY');
    expect(bodyInput).toBeDefined();
  });

  it('should instantiate package_declare_header statement block', () => {
    const headerBlock = workspace.newBlock('package_declare_header');
    expect(headerBlock.type).toBe('package_declare_header');
    expect(headerBlock.nextConnection).not.toBeNull();
  });

  it('should validate single package constraint on workspace', () => {
    // 0 package blocks -> valid
    expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);

    // 1 package block -> valid
    workspace.newBlock('package_declare');
    expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);

    // 2 package blocks -> invalid
    workspace.newBlock('package_declare');
    const result = validateWorkspacePackageStructure(workspace);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Multiple package definitions detected');
  });
});
