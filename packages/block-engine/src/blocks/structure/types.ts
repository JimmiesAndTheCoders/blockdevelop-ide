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
 * Valid block types allowed as direct child members of a Class.
 */
export const VALID_CLASS_FIELD_TYPES = new Set([
  'variable_declare_typed',
  'variable_declare_inferred',
  'variables_declare_scoped',
]);

export const VALID_CLASS_METHOD_TYPES = new Set([
  'function_def_typed',
  'function_def_simple',
  'procedure_defnoreturn_custom',
  'procedure_defreturn_custom',
]);

export const VALID_CLASS_CONSTRUCTOR_TYPES = new Set([
  'class_constructor',
  'function_def_typed',
]);

/**
 * Validates and sanitizes a package/namespace identifier string.
 */
export function sanitizePackageNamespace(rawName: string): string {
  if (!rawName || typeof rawName !== 'string') {
    return '';
  }

  return rawName
    .trim()
    .replace(/[^a-zA-Z0-9_.]/g, '') // Strip non-identifier characters
    .replace(/\.{2,}/g, '.') // Replace consecutive dots
    .replace(/^\.+|\.+$/g, ''); // Strip leading and trailing dots
}

/**
 * Checks if a string is a valid dot-separated package identifier.
 */
export function isValidPackageNamespace(name: string): boolean {
  if (!name || typeof name !== 'string') return true;
  const trimmed = name.trim();
  if (!trimmed) return true;
  return /^[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(trimmed);
}

/**
 * Validates an import path (e.g. "haxe.ds.Vector", "com.example.Player", "com.example.*").
 */
export function isValidImportPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  return /^[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*(?:\.\*)?$/.test(trimmed);
}
