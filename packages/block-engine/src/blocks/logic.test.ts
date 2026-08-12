import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { LOGIC_BLOCK_DEFINITIONS, registerLogicBlocks } from './logic';

describe('Logic & Control Blocks Registration Suite', () => {
  it('should expose 9 custom logic and control block definitions', () => {
    expect(LOGIC_BLOCK_DEFINITIONS.length).toBe(9);
  });

  it('should register logic blocks into Blockly.Blocks without throwing', () => {
    registerLogicBlocks();
    expect(Blockly.Blocks['logic_if_else']).toBeDefined();
    expect(Blockly.Blocks['logic_compare']).toBeDefined();
    expect(Blockly.Blocks['logic_operation']).toBeDefined();
    expect(Blockly.Blocks['controls_repeat_ext']).toBeDefined();
    expect(Blockly.Blocks['controls_while']).toBeDefined();
    expect(Blockly.Blocks['controls_for']).toBeDefined();
  });
});
