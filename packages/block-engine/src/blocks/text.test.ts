import { describe, it, expect } from 'vitest';
import * as Blockly from 'blockly/core';
import { TEXT_BLOCK_DEFINITIONS, registerTextBlocks } from './text';

describe('Text & String Manipulation Blocks Registration Suite', () => {
  it('should expose 6 custom text and string manipulation block definitions', () => {
    expect(TEXT_BLOCK_DEFINITIONS.length).toBe(6);
  });

  it('should register text blocks into Blockly.Blocks without throwing', () => {
    registerTextBlocks();
    expect(Blockly.Blocks['text_literal']).toBeDefined();
    expect(Blockly.Blocks['text_join_custom']).toBeDefined();
    expect(Blockly.Blocks['text_length_custom']).toBeDefined();
    expect(Blockly.Blocks['text_isEmpty_custom']).toBeDefined();
    expect(Blockly.Blocks['text_print_custom']).toBeDefined();
    expect(Blockly.Blocks['text_log_custom']).toBeDefined();
  });
});
