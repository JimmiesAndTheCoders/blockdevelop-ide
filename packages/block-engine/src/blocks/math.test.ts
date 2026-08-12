import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { MATH_BLOCK_DEFINITIONS, registerMathBlocks } from './math';

describe('Data & Mathematics Blocks Registration Suite', () => {
  it('should expose 7 custom mathematics block definitions', () => {
    expect(MATH_BLOCK_DEFINITIONS.length).toBe(7);
  });

  it('should register mathematics blocks into Blockly.Blocks without throwing', () => {
    registerMathBlocks();
    expect(Blockly.Blocks['math_number']).toBeDefined();
    expect(Blockly.Blocks['math_arithmetic']).toBeDefined();
    expect(Blockly.Blocks['math_single']).toBeDefined();
    expect(Blockly.Blocks['math_round']).toBeDefined();
    expect(Blockly.Blocks['math_modulo']).toBeDefined();
    expect(Blockly.Blocks['math_random_int']).toBeDefined();
    expect(Blockly.Blocks['math_constrain']).toBeDefined();
  });
});
