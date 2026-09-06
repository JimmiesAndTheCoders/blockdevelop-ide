import { describe, it, expect } from 'vitest';
import {
  LOOP_MODE_OPTIONS,
  LOOP_JUMP_ACTION_OPTIONS,
  LOOP_ITERATOR_DIRECTION_OPTIONS,
  SWITCH_CASE_BREAK_OPTIONS,
  TERNARY_OPERATOR_OPTIONS,
  EXCEPTION_THROW_OPTIONS,
  CONTROL_FLOW_BLOCK_TYPES,
  isLoopMode,
  isLoopJumpAction,
  isBranchStructureKind,
  isExceptionStructureKind,
} from './types';

describe('Phase 4.3 - Control Flow Type System & Validator Suite', () => {
  describe('1. Loop Modes and Jump Constants', () => {
    it('should expose all 5 loop modes in LOOP_MODE_OPTIONS', () => {
      const modes = LOOP_MODE_OPTIONS.map(([_, v]) => v);
      expect(modes).toEqual([
        'WHILE_DO',
        'DO_WHILE',
        'FOR_EACH_RANGE',
        'FOR_IN_ITERATOR',
        'FOR_KEY_VALUE_MAP',
      ]);
    });

    it('should expose jump actions in LOOP_JUMP_ACTION_OPTIONS', () => {
      const actions = LOOP_JUMP_ACTION_OPTIONS.map(([_, v]) => v);
      expect(actions).toEqual(['BREAK', 'CONTINUE']);
    });

    it('should expose iterator direction options', () => {
      const directions = LOOP_ITERATOR_DIRECTION_OPTIONS.map(([_, v]) => v);
      expect(directions).toEqual(['FORWARD', 'REVERSE']);
    });
  });

  describe('2. Branching and Selection Options', () => {
    it('should expose switch break and fallthrough options', () => {
      const breakOpts = SWITCH_CASE_BREAK_OPTIONS.map(([_, v]) => v);
      expect(breakOpts).toEqual(['BREAK', 'FALLTHROUGH']);
    });

    it('should expose ternary and null coalescing options', () => {
      const ternaryOpts = TERNARY_OPERATOR_OPTIONS.map(([_, v]) => v);
      expect(ternaryOpts).toEqual(['TERNARY', 'NULL_COALESCING']);
    });
  });

  describe('3. Exception Handling Options', () => {
    it('should expose throw and rethrow options', () => {
      const throwOpts = EXCEPTION_THROW_OPTIONS.map(([_, v]) => v);
      expect(throwOpts).toEqual(['THROW', 'RETHROW']);
    });
  });

  describe('4. Type Guard Predicates', () => {
    it('isLoopMode should validate valid and reject invalid values', () => {
      expect(isLoopMode('WHILE_DO')).toBe(true);
      expect(isLoopMode('DO_WHILE')).toBe(true);
      expect(isLoopMode('FOR_EACH_RANGE')).toBe(true);
      expect(isLoopMode('FOR_IN_ITERATOR')).toBe(true);
      expect(isLoopMode('FOR_KEY_VALUE_MAP')).toBe(true);
      expect(isLoopMode('INVALID_LOOP')).toBe(false);
      expect(isLoopMode(null)).toBe(false);
      expect(isLoopMode(123)).toBe(false);
    });

    it('isLoopJumpAction should validate BREAK and CONTINUE', () => {
      expect(isLoopJumpAction('BREAK')).toBe(true);
      expect(isLoopJumpAction('CONTINUE')).toBe(true);
      expect(isLoopJumpAction('RETURN')).toBe(false);
      expect(isLoopJumpAction(undefined)).toBe(false);
    });

    it('isBranchStructureKind should validate branch kinds', () => {
      expect(isBranchStructureKind('IF_ELSE_MUTATOR')).toBe(true);
      expect(isBranchStructureKind('SWITCH_CASE_DEFAULT')).toBe(true);
      expect(isBranchStructureKind('TERNARY_CONDITIONAL')).toBe(true);
      expect(isBranchStructureKind('NULL_COALESCING')).toBe(true);
      expect(isBranchStructureKind('OTHER')).toBe(false);
    });

    it('isExceptionStructureKind should validate exception structure kinds', () => {
      expect(isExceptionStructureKind('TRY_CATCH_FINALLY')).toBe(true);
      expect(isExceptionStructureKind('MULTI_CATCH')).toBe(true);
      expect(isExceptionStructureKind('THROW_EXCEPTION')).toBe(true);
      expect(isExceptionStructureKind('CATCH_ONLY')).toBe(false);
    });
  });

  describe('5. Block Type Whitelist Catalog', () => {
    it('should contain all 12 planned control flow block types', () => {
      expect(CONTROL_FLOW_BLOCK_TYPES.size).toBe(12);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_while_condition')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_do_while')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_for_each_range')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_for_element_iterator')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_loop_jump')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_if_mutator')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('controls_switch_case')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('logic_ternary_operator')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('logic_null_coalescing')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('exception_try_catch_finally')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('exception_throw')).toBe(true);
      expect(CONTROL_FLOW_BLOCK_TYPES.has('exception_rethrow')).toBe(true);
    });
  });
});
