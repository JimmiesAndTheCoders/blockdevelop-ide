import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  PACKAGE_BLOCK_DEFINITIONS,
  sanitizePackageNamespace,
  isValidPackageNamespace,
  validateWorkspacePackageStructure,
} from './index';

function getBlockWarningText(block: Blockly.Block): string | null {
  const b = block as unknown as {
    warningText?: string | null;
    warning?: { getText?: () => string | null };
    getWarningText?: () => string | null;
  };
  if (typeof b.getWarningText === 'function') {
    return b.getWarningText();
  }
  if (b.warning && typeof b.warning.getText === 'function') {
    return b.warning.getText();
  }
  return b.warningText ?? null;
}

describe('Phase 4.2 - Section 2.1: Package Namespaces & Declarations Suite', () => {
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

  describe('1. Package Block Schema Registrations', () => {
    it('should define all 4 package block variants (declarations, wrappers & aliases)', () => {
      expect(PACKAGE_BLOCK_DEFINITIONS.length).toBe(4);
      const types = PACKAGE_BLOCK_DEFINITIONS.map((def) => def.type);
      expect(types).toContain('package_declaration');
      expect(types).toContain('package_block_wrapper');
      expect(types).toContain('package_declare');
      expect(types).toContain('package_declare_header');
    });

    it('should instantiate package_declaration statement block with nextConnection', () => {
      const block = workspace.newBlock('package_declaration');
      expect(block.type).toBe('package_declaration');
      expect(block.nextConnection).not.toBeNull();

      const nameField = block.getField('PACKAGE_NAME') as Blockly.FieldTextInput;
      expect(nameField.getValue()).toBe('com.example.app');
    });

    it('should instantiate package_block_wrapper container block with inner BODY input', () => {
      const block = workspace.newBlock('package_block_wrapper');
      expect(block.type).toBe('package_block_wrapper');
      expect(block.getInput('BODY')).toBeDefined();

      const nameField = block.getField('PACKAGE_NAME') as Blockly.FieldTextInput;
      nameField.setValue('net.blockdevelop.core');
      expect(nameField.getValue()).toBe('net.blockdevelop.core');
    });
  });

  describe('2. Reverse-DNS Namespace Sanitization & Validation', () => {
    it('should sanitize package names by stripping invalid characters and double dots', () => {
      expect(sanitizePackageNamespace('  com.example.game  ')).toBe('com.example.game');
      expect(sanitizePackageNamespace('com...game..')).toBe('com.game');
      expect(sanitizePackageNamespace('com.@!#example.$.game')).toBe('com.example.game');
      expect(sanitizePackageNamespace('.leading.and.trailing.')).toBe('leading.and.trailing');
    });

    it('should validate valid reverse-DNS dot notation identifiers', () => {
      expect(isValidPackageNamespace('com.example.app')).toBe(true);
      expect(isValidPackageNamespace('net.blockdevelop.engine')).toBe(true);
      expect(isValidPackageNamespace('main')).toBe(true);
      expect(isValidPackageNamespace('')).toBe(true); // default root
    });

    it('should reject invalid package identifiers starting with digits or containing symbols', () => {
      expect(isValidPackageNamespace('123.bad.pkg')).toBe(false);
      expect(isValidPackageNamespace('com.123start')).toBe(false);
      expect(isValidPackageNamespace('com..double')).toBe(false);
    });
  });

  describe('3. Singleton Package Constraint Enforcement', () => {
    it('should pass validation when 0 or 1 package block exists', () => {
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);

      const pkg1 = workspace.newBlock('package_declaration');
      expect(validateWorkspacePackageStructure(workspace).valid).toBe(true);
      expect(getBlockWarningText(pkg1)).toBeNull();
    });

    it('should detect violation and set warning badge when multiple package blocks exist', () => {
      const pkg1 = workspace.newBlock('package_declaration');
      const pkg2 = workspace.newBlock('package_block_wrapper');

      const result = validateWorkspacePackageStructure(workspace);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Multiple package definitions detected');

      // Disposing second package restores valid singleton state
      pkg2.dispose(false);
      const restoredResult = validateWorkspacePackageStructure(workspace);
      expect(restoredResult.valid).toBe(true);
      expect(getBlockWarningText(pkg1)).toBeNull();
    });
  });
});
