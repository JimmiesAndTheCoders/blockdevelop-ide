import { describe, it, expect } from 'vitest';
import {
  sanitizePath,
  assertPathWithinBoundary,
  assertNonEmptyString,
  assertPositiveInteger,
  assertArrayOfStrings,
  escapeCLIArgument,
  IPCValidationError,
} from './validation';

describe('IPC Main Validation & Security Guardrails', () => {
  describe('sanitizePath', () => {
    it('should normalize valid paths', () => {
      expect(sanitizePath('folder/sub/../file.txt')).toContain('folder');
    });

    it('should throw IPCValidationError on null-byte character injection', () => {
      expect(() => sanitizePath('folder/\0/file.txt')).toThrow(IPCValidationError);
    });

    it('should throw IPCValidationError on non-string inputs', () => {
      expect(() => sanitizePath(12345)).toThrow(IPCValidationError);
      expect(() => sanitizePath(null)).toThrow(IPCValidationError);
    });
  });

  describe('assertPathWithinBoundary', () => {
    it('should allow paths within the workspace boundary', () => {
      const root = process.platform === 'win32' ? 'C:\\workspace' : '/workspace';
      const target = process.platform === 'win32' ? 'C:\\workspace\\src\\index.ts' : '/workspace/src/index.ts';
      expect(assertPathWithinBoundary(target, root)).toBeDefined();
    });

    it('should throw IPCValidationError when path escapes workspace boundary', () => {
      const root = process.platform === 'win32' ? 'C:\\workspace' : '/workspace';
      const target =
        process.platform === 'win32'
          ? 'C:\\workspace\\..\\..\\Windows\\System32'
          : '/workspace/../../etc/passwd';
      expect(() => assertPathWithinBoundary(target, root)).toThrow(IPCValidationError);
    });
  });

  describe('assertNonEmptyString', () => {
    it('should return trimmed string for valid inputs', () => {
      expect(assertNonEmptyString('  hello world  ', 'test')).toBe('hello world');
    });

    it('should throw for empty or whitespace-only strings', () => {
      expect(() => assertNonEmptyString('   ', 'test')).toThrow(IPCValidationError);
    });
  });

  describe('assertPositiveInteger', () => {
    it('should pass for positive integers', () => {
      expect(assertPositiveInteger(1234, 'pid')).toBe(1234);
    });

    it('should throw for negative numbers or zero', () => {
      expect(() => assertPositiveInteger(0, 'pid')).toThrow(IPCValidationError);
      expect(() => assertPositiveInteger(-1, 'pid')).toThrow(IPCValidationError);
    });
  });

  describe('assertArrayOfStrings', () => {
    it('should return array when all items are valid strings', () => {
      expect(assertArrayOfStrings(['arg1', 'arg2'], 'args')).toEqual(['arg1', 'arg2']);
    });

    it('should throw when array contains non-string items', () => {
      expect(() => assertArrayOfStrings(['arg1', 42], 'args')).toThrow(IPCValidationError);
    });
  });

  describe('escapeCLIArgument', () => {
    it('should strip null bytes and line breaks', () => {
      const sanitized = escapeCLIArgument('hello\0world\r\n');
      expect(sanitized).not.toContain('\0');
      expect(sanitized).not.toContain('\r');
      expect(sanitized).not.toContain('\n');
    });
  });
});
