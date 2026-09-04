import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  ADVANCED_FUNCTION_BLOCK_DEFINITIONS,
  FUNCTION_ACCESS_OPTIONS,
  FUNCTION_MODIFIER_OPTIONS,
} from './index';

describe('Advanced Function Definition & Invocation Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerBlockDefinitions();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
  });

  it('should define all 10 advanced function definition, return, and invocation blocks', () => {
    expect(ADVANCED_FUNCTION_BLOCK_DEFINITIONS.length).toBe(10);
    const types = ADVANCED_FUNCTION_BLOCK_DEFINITIONS.map((def) => def.type);
    expect(types).toContain('function_param_item');
    expect(types).toContain('function_def_typed');
    expect(types).toContain('function_def_simple');
    expect(types).toContain('return_value');
    expect(types).toContain('return_bare');
    expect(types).toContain('function_call_typed');
    expect(types).toContain('function_call_typed_statement');
    expect(types).toContain('method_call_instance');
    expect(types).toContain('method_call_instance_statement');
    expect(types).toContain('method_call_static');
  });

  it('should expose access and modifier dropdown options', () => {
    const accessVals = FUNCTION_ACCESS_OPTIONS.map(([_, v]) => v);
    expect(accessVals).toEqual(['PUBLIC', 'PRIVATE', 'PROTECTED', 'INTERNAL']);

    const modVals = FUNCTION_MODIFIER_OPTIONS.map(([_, v]) => v);
    expect(modVals).toEqual(['NONE', 'STATIC', 'OVERRIDE', 'INLINE', 'STATIC_INLINE']);
  });

  it('should instantiate function_call_typed expression and statement blocks', () => {
    const callExpr = workspace.newBlock('function_call_typed');
    const callStmt = workspace.newBlock('function_call_typed_statement');

    expect(callExpr.outputConnection).not.toBeNull();
    expect(callStmt.previousConnection).not.toBeNull();
    expect(callStmt.nextConnection).not.toBeNull();

    const nameField = callExpr.getField('NAME') as Blockly.FieldTextInput;
    nameField.setValue('computeTotal');
    expect(nameField.getValue()).toBe('computeTotal');
  });

  it('should instantiate method_call_instance on target with arguments', () => {
    const instanceCall = workspace.newBlock('method_call_instance');
    expect(instanceCall.type).toBe('method_call_instance');
    expect(instanceCall.outputConnection).not.toBeNull();

    const targetBlock = workspace.newBlock('variable_get_scoped_typed');
    const arg0Block = workspace.newBlock('math_number');

    instanceCall.getInput('TARGET')?.connection?.connect(targetBlock.outputConnection!);
    instanceCall.getInput('ARG0')?.connection?.connect(arg0Block.outputConnection!);

    const methodField = instanceCall.getField('METHOD') as Blockly.FieldTextInput;
    methodField.setValue('takeDamage');
    expect(methodField.getValue()).toBe('takeDamage');
    expect(instanceCall.getChildren(false).length).toBe(2);
  });

  it('should instantiate method_call_static and set class and method names', () => {
    const staticCall = workspace.newBlock('method_call_static');
    expect(staticCall.type).toBe('method_call_static');
    expect(staticCall.outputConnection).not.toBeNull();

    const classField = staticCall.getField('CLASS_NAME') as Blockly.FieldTextInput;
    const methodField = staticCall.getField('METHOD') as Blockly.FieldTextInput;

    classField.setValue('SoundManager');
    methodField.setValue('playBGM');

    expect(classField.getValue()).toBe('SoundManager');
    expect(methodField.getValue()).toBe('playBGM');
  });
});
