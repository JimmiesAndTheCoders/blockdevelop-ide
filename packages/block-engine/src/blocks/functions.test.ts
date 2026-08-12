import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { FUNCTION_BLOCK_DEFINITIONS, registerFunctionBlocks } from './functions';

describe('Functions, Events & Callbacks Blocks Registration Suite', () => {
  it('should expose 5 custom function and event block definitions', () => {
    expect(FUNCTION_BLOCK_DEFINITIONS.length).toBe(5);
  });

  it('should register function blocks into Blockly.Blocks without throwing', () => {
    registerFunctionBlocks();
    expect(Blockly.Blocks['procedure_defnoreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_defreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_callnoreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_callreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['event_listener']).toBeDefined();
  });
});
