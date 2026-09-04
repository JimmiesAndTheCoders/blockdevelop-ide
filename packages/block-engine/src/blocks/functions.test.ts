import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { FUNCTION_BLOCK_DEFINITIONS, registerFunctionBlocks } from './functions';

describe('Functions, Events & Signatures Blocks Registration Suite', () => {
  it('should expose all 15 custom function, signature, and invocation block definitions', () => {
    expect(FUNCTION_BLOCK_DEFINITIONS.length).toBe(15);
  });

  it('should register function blocks into Blockly.Blocks without throwing', () => {
    registerFunctionBlocks();
    expect(Blockly.Blocks['procedure_defnoreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_defreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_callnoreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['procedure_callreturn_custom']).toBeDefined();
    expect(Blockly.Blocks['event_listener']).toBeDefined();
    expect(Blockly.Blocks['function_param_item']).toBeDefined();
    expect(Blockly.Blocks['function_def_typed']).toBeDefined();
    expect(Blockly.Blocks['function_def_simple']).toBeDefined();
    expect(Blockly.Blocks['return_value']).toBeDefined();
    expect(Blockly.Blocks['return_bare']).toBeDefined();
    expect(Blockly.Blocks['function_call_typed']).toBeDefined();
    expect(Blockly.Blocks['function_call_typed_statement']).toBeDefined();
    expect(Blockly.Blocks['method_call_instance']).toBeDefined();
    expect(Blockly.Blocks['method_call_instance_statement']).toBeDefined();
    expect(Blockly.Blocks['method_call_static']).toBeDefined();
  });
});
