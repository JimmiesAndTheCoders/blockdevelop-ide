/**
 * @blockdevelop/block-engine
 * Control Flow, Iteration, Branching & Exception Types, Constants & Guards.
 */

// ============================================================================
// 1. Loop Modes & Iteration Definitions
// ============================================================================

export type LoopMode =
  | 'WHILE_DO'
  | 'DO_WHILE'
  | 'FOR_EACH_RANGE'
  | 'FOR_IN_ITERATOR'
  | 'FOR_KEY_VALUE_MAP';

export const LOOP_MODE_OPTIONS: [string, string][] = [
  ['while (condition)', 'WHILE_DO'],
  ['do ... while (condition)', 'DO_WHILE'],
  ['for each (i) in range', 'FOR_EACH_RANGE'],
  ['for (item in list)', 'FOR_IN_ITERATOR'],
  ['for (key => value in map)', 'FOR_KEY_VALUE_MAP'],
];

export type LoopJumpAction = 'BREAK' | 'CONTINUE';

export const LOOP_JUMP_ACTION_OPTIONS: [string, string][] = [
  ['break out of loop', 'BREAK'],
  ['continue to next iteration', 'CONTINUE'],
];

export const LOOP_ITERATOR_DIRECTION_OPTIONS: [string, string][] = [
  ['forward (increment ++)', 'FORWARD'],
  ['reverse (decrement --)', 'REVERSE'],
];

// ============================================================================
// 2. Branching & Selection Definitions
// ============================================================================

export type BranchStructureKind =
  | 'IF_ELSE_MUTATOR'
  | 'SWITCH_CASE_DEFAULT'
  | 'TERNARY_CONDITIONAL'
  | 'NULL_COALESCING';

export const SWITCH_CASE_BREAK_OPTIONS: [string, string][] = [
  ['break (stop)', 'BREAK'],
  ['fallthrough (continue down)', 'FALLTHROUGH'],
];

export const TERNARY_OPERATOR_OPTIONS: [string, string][] = [
  ['ternary (? :)', 'TERNARY'],
  ['null-coalescing (??)', 'NULL_COALESCING'],
];

// ============================================================================
// 3. Exception & Error Handling Definitions
// ============================================================================

export type ExceptionStructureKind =
  | 'TRY_CATCH_FINALLY'
  | 'MULTI_CATCH'
  | 'THROW_EXCEPTION';

export const EXCEPTION_THROW_OPTIONS: [string, string][] = [
  ['throw error', 'THROW'],
  ['rethrow current error', 'RETHROW'],
];

// ============================================================================
// 4. Mutator Extra State Descriptors
// ============================================================================

export interface IfMutatorExtraState {
  elseIfCount: number;
  hasElse: boolean;
}

export interface SwitchMutatorExtraState {
  caseCount: number;
  hasDefault: boolean;
}

export interface CatchClauseSpec {
  varName: string;
  typeName: string;
}

export interface TryCatchMutatorExtraState {
  catchCount: number;
  hasFinally: boolean;
  catchClauses?: CatchClauseSpec[];
}

// ============================================================================
// 5. Block Type Whitelists & Identifier Sets
// ============================================================================

export const CONTROL_FLOW_BLOCK_TYPES = new Set<string>([
  'controls_while_condition',
  'controls_do_while',
  'controls_for_each_range',
  'controls_for_element_iterator',
  'controls_loop_jump',
  'controls_if_mutator',
  'controls_switch_case',
  'logic_ternary_operator',
  'logic_null_coalescing',
  'exception_try_catch_finally',
  'exception_throw',
  'exception_rethrow',
]);

// ============================================================================
// 6. Type Guard Predicates
// ============================================================================

export function isLoopMode(val: unknown): val is LoopMode {
  return (
    typeof val === 'string' &&
    ['WHILE_DO', 'DO_WHILE', 'FOR_EACH_RANGE', 'FOR_IN_ITERATOR', 'FOR_KEY_VALUE_MAP'].includes(
      val as LoopMode,
    )
  );
}

export function isLoopJumpAction(val: unknown): val is LoopJumpAction {
  return typeof val === 'string' && ['BREAK', 'CONTINUE'].includes(val as LoopJumpAction);
}

export function isBranchStructureKind(val: unknown): val is BranchStructureKind {
  return (
    typeof val === 'string' &&
    ['IF_ELSE_MUTATOR', 'SWITCH_CASE_DEFAULT', 'TERNARY_CONDITIONAL', 'NULL_COALESCING'].includes(
      val as BranchStructureKind,
    )
  );
}

export function isExceptionStructureKind(val: unknown): val is ExceptionStructureKind {
  return (
    typeof val === 'string' &&
    ['TRY_CATCH_FINALLY', 'MULTI_CATCH', 'THROW_EXCEPTION'].includes(
      val as ExceptionStructureKind,
    )
  );
}
