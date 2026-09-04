/**
 * Structural Package & Scope Types and Validators for BlockDevelop IDE.
 */

export const CLASS_ACCESS_OPTIONS: [string, string][] = [
  ['public', 'PUBLIC'],
  ['private', 'PRIVATE'],
  ['internal', 'INTERNAL'],
];

export const CLASS_MODIFIER_OPTIONS: [string, string][] = [
  ['standard', 'NONE'],
  ['final', 'FINAL'],
  ['abstract', 'ABSTRACT'],
];

export const IMPORT_KIND_OPTIONS: [string, string][] = [
  ['single symbol', 'SYMBOL'],
  ['wildcard (.*)', 'WILDCARD'],
  ['aliased (as)', 'ALIAS'],
];

/**
 * Valid block types allowed as direct child members of an Interface.
 */
export const VALID_INTERFACE_MEMBER_TYPES = new Set([
  'interface_method_signature',
  'interface_property_signature',
]);

export const VALID_CLASS_FIELD_TYPES = new Set([
  'variable_declare_typed',
  'variable_declare_inferred',
  'variables_declare_scoped',
  'class_property_declaration',
]);

export const VALID_CLASS_METHOD_TYPES = new Set([
  'function_def_typed',
  'function_def_simple',
  'procedure_defnoreturn_custom',
  'procedure_defreturn_custom',
  'class_method_declaration',
]);

export const VALID_CLASS_CONSTRUCTOR_TYPES = new Set([
  'class_constructor',
  'class_constructor_declaration',
  'function_def_typed',
]);

export const PACKAGE_BLOCK_TYPES = new Set([
  'package_declaration',
  'package_block_wrapper',
  'package_declare',
  'package_declare_header',
]);

export const PROPERTY_ACCESSOR_READ_OPTIONS: [string, string][] = [
  ['default (read)', 'DEFAULT'],
  ['get (getter)', 'GET'],
  ['null (private read)', 'NULL'],
  ['never', 'NEVER'],
];

export const PROPERTY_ACCESSOR_WRITE_OPTIONS: [string, string][] = [
  ['default (write)', 'DEFAULT'],
  ['set (setter)', 'SET'],
  ['null (readonly)', 'NULL'],
  ['never', 'NEVER'],
];

/**
 * Validates and sanitizes a comma-separated list of interface identifiers.
 */

export function sanitizeInterfaceList(rawList: string): string {
  if (!rawList || typeof rawList !== 'string') return '';
  return rawList
    .split(',')
    .map((item) => sanitizePackageNamespace(item))
    .filter((item) => item.length > 0)
    .join(', ');
}

export function sanitizePackageNamespace(rawName: string): string {
  if (!rawName || typeof rawName !== 'string') {
    return '';
  }

  return rawName
    .trim()
    .replace(/[^a-zA-Z0-9_.]/g, '') // Strip non-identifier characters
    .replace(/\.{2,}/g, '.') // Replace consecutive dots with a single dot
    .replace(/^\.+|\.+$/g, ''); // Strip leading and trailing dots
}

/**
 * Strictly verifies whether a string conforms to valid reverse-DNS dot-separated package notation.
 * e.g., 'com.example.game', 'net.blockdevelop.core', 'main'
 */
export function isValidPackageNamespace(name: string): boolean {
  if (!name || typeof name !== 'string') return true;
  const trimmed = name.trim();
  if (!trimmed) return true; // Root default package is allowed

  const segments = trimmed.split('.');
  const segmentRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return segments.every((segment) => segmentRegex.test(segment));
}

/**
 * Validates an import path (e.g. "haxe.ds.Vector", "com.example.Player", "com.example.*").
 */
export function isValidImportPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  if (!trimmed) return false;

  if (trimmed.endsWith('.*')) {
    const base = trimmed.substring(0, trimmed.length - 2);
    return isValidPackageNamespace(base);
  }

  return isValidPackageNamespace(trimmed);
}
