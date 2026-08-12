import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { VARIABLE_BLOCK_DEFINITIONS, registerVariableBlocks } from './variables';

describe('Variables & Memory Management Blocks Registration Suite', () => {
  it('should expose 5 custom variable block definitions', () => {
    expect(VARIABLE_BLOCK_DEFINITIONS.length).toBe(5);
  });

  it('should register variable blocks into Blockly.Blocks without throwing', () => {
    registerVariableBlocks();
    expect(Blockly.Blocks['variables_get_custom']).toBeDefined();
    expect(Blockly.Blocks['variables_set_custom']).toBeDefined();
    expect(Blockly.Blocks['variables_declare_scoped']).toBeDefined();
    expect(Blockly.Blocks['variables_get_scoped']).toBeDefined();
    expect(Blockly.Blocks['variables_set_scoped']).toBeDefined();
  });
});
