/**
 * Core Type Definitions and Primitives for BlockDevelop Scoping & Type System.
 */

export const PRIMITIVE_TYPE_OPTIONS: [string, string][] = [
  ['Int', 'INT'],
  ['Float', 'FLOAT'],
  ['String', 'STRING'],
  ['Bool', 'BOOL'],
  ['Dynamic / Any', 'DYNAMIC'],
  ['Void', 'VOID'],
  ['Array<T>', 'ARRAY'],
  ['Map<K, V>', 'MAP'],
  ['Custom Type...', 'CUSTOM'],
];

export const ACCESS_MODIFIER_OPTIONS: [string, string][] = [
  ['public', 'PUBLIC'],
  ['private', 'PRIVATE'],
  ['protected', 'PROTECTED'],
  ['internal', 'INTERNAL'],
];

export const VARIABLE_KIND_OPTIONS: [string, string][] = [
  ['var', 'VAR'],
  ['let', 'LET'],
  ['const', 'CONST'],
  ['final', 'FINAL'],
];

export const SCOPE_LEVEL_OPTIONS: [string, string][] = [
  ['local', 'LOCAL'],
  ['field (this)', 'FIELD'],
  ['static', 'STATIC'],
  ['global', 'GLOBAL'],
];

export const VARIABLE_TARGET_SCOPE_OPTIONS: [string, string][] = [
  ['local', 'LOCAL'],
  ['this.', 'THIS'],
  ['super.', 'SUPER'],
  ['static Class.', 'STATIC'],
  ['global.', 'GLOBAL'],
];

export const ASSIGNMENT_OPERATOR_OPTIONS: [string, string][] = [
  ['=', 'ASSIGN'],
  ['+=', 'ADD_ASSIGN'],
  ['-=', 'SUB_ASSIGN'],
  ['*=', 'MUL_ASSIGN'],
  ['/=', 'DIV_ASSIGN'],
  ['%=', 'MOD_ASSIGN'],
];

export const UNARY_MUTATION_OPERATOR_OPTIONS: [string, string][] = [
  ['++', 'INC'],
  ['--', 'DEC'],
];

export const UNARY_MUTATION_POSITION_OPTIONS: [string, string][] = [
  ['postfix (x++)', 'POSTFIX'],
  ['prefix (++x)', 'PREFIX'],
];

export interface TypeDescriptor {
  kind: 'primitive' | 'array' | 'map' | 'custom' | 'nullable';
  baseType: string;
  typeParam?: string | TypeDescriptor;
  keyType?: string | TypeDescriptor;
  valueType?: string | TypeDescriptor;
  isNullable?: boolean;
}
