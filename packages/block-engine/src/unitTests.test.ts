import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import {
  initializeBlockEngine,
  createBlockDevelopDarkTheme,
  registerBlockDefinitions,
  CORE_BLOCK_DEFINITIONS,
  serializeWorkspaceToJson,
  deserializeWorkspaceFromJson,
  serializeWorkspaceToJsonString,
  deserializeWorkspaceFromJsonString,
  serializeWorkspaceToXml,
  deserializeWorkspaceFromXml,
  createIDEGridConfig,
} from './index';

describe('Phase 4.8 Unit Test Suite - Core Engine, Schemas & Serialization', () => {
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

  describe('1. Workspace Initialization & Custom Theme Registration', () => {
    it('should initialize the block engine and return version metadata', () => {
      const result = initializeBlockEngine();
      expect(result).toBeDefined();
      expect(result).toContain('Block Engine');
      expect(result).toContain('Initialized');
    });

    it('should create and configure the blockdevelop-dark custom theme', () => {
      const theme = createBlockDevelopDarkTheme();
      expect(theme.name).toBe('blockdevelop-dark');

      // Validate component styles match IDE dark tokens
      const styles = theme.componentStyles;
      expect(styles.workspaceBackgroundColour).toBe('#181818');
      expect(styles.toolboxBackgroundColour).toBe('#1f1f1f');
      expect(styles.insertionMarkerColour).toBe('#007acc');

      // Validate category block styles
      const blockStyles = theme.blockStyles;
      expect(blockStyles.logic_blocks?.colourPrimary).toBe('#007ACC');
      expect(blockStyles.math_blocks?.colourPrimary).toBe('#8A2BE2');
      expect(blockStyles.text_blocks?.colourPrimary).toBe('#10B981');
      expect(blockStyles.variable_blocks?.colourPrimary).toBe('#EA8220');
      expect(blockStyles.procedure_blocks?.colourPrimary).toBe('#E11D48');
      expect(blockStyles.event_blocks?.colourPrimary).toBe('#06B6D4');
    });

    it('should create valid grid configurations for workspace initialization', () => {
      const defaultGrid = createIDEGridConfig();
      expect(defaultGrid.spacing).toBe(20);
      expect(defaultGrid.snap).toBe(true);
      expect(defaultGrid.colour).toBe('#3c3c3c');

      const customGrid = createIDEGridConfig({ spacing: 30, mode: 'lines', snap: false });
      expect(customGrid.spacing).toBe(30);
      expect(customGrid.length).toBe(30);
      expect(customGrid.snap).toBe(false);
    });
  });

  describe('2. Block Definition Schema Registration Across All Core Categories', () => {
    it('should register all core block types into global Blockly.Blocks registry', () => {
      registerBlockDefinitions();

      // Check schema definition counts
      expect(CORE_BLOCK_DEFINITIONS.length).toBeGreaterThanOrEqual(30);

      // Verify Logic & Control Category
      expect(Blockly.Blocks['logic_if_else']).toBeDefined();
      expect(Blockly.Blocks['logic_compare']).toBeDefined();
      expect(Blockly.Blocks['logic_operation']).toBeDefined();
      expect(Blockly.Blocks['logic_negate']).toBeDefined();
      expect(Blockly.Blocks['logic_boolean']).toBeDefined();
      expect(Blockly.Blocks['controls_repeat_ext']).toBeDefined();
      expect(Blockly.Blocks['controls_while']).toBeDefined();
      expect(Blockly.Blocks['controls_for']).toBeDefined();
      expect(Blockly.Blocks['controls_flow_statements']).toBeDefined();

      // Verify Mathematics Category
      expect(Blockly.Blocks['math_number']).toBeDefined();
      expect(Blockly.Blocks['math_arithmetic']).toBeDefined();
      expect(Blockly.Blocks['math_single']).toBeDefined();
      expect(Blockly.Blocks['math_round']).toBeDefined();
      expect(Blockly.Blocks['math_modulo']).toBeDefined();
      expect(Blockly.Blocks['math_random_int']).toBeDefined();
      expect(Blockly.Blocks['math_constrain']).toBeDefined();

      // Verify Text & Strings Category
      expect(Blockly.Blocks['text_literal']).toBeDefined();
      expect(Blockly.Blocks['text_join_custom']).toBeDefined();
      expect(Blockly.Blocks['text_length_custom']).toBeDefined();
      expect(Blockly.Blocks['text_isEmpty_custom']).toBeDefined();
      expect(Blockly.Blocks['text_print_custom']).toBeDefined();
      expect(Blockly.Blocks['text_log_custom']).toBeDefined();

      // Verify Variables Category
      expect(Blockly.Blocks['variables_get_custom']).toBeDefined();
      expect(Blockly.Blocks['variables_set_custom']).toBeDefined();
      expect(Blockly.Blocks['variable_declare_typed']).toBeDefined();
      expect(Blockly.Blocks['variable_declare_inferred']).toBeDefined();
      expect(Blockly.Blocks['variable_declare_local']).toBeDefined();
      expect(Blockly.Blocks['variable_get_scoped_typed']).toBeDefined();
      expect(Blockly.Blocks['variable_assign_op']).toBeDefined();
      expect(Blockly.Blocks['variable_increment_decrement']).toBeDefined();
      expect(Blockly.Blocks['type_primitive']).toBeDefined();
      expect(Blockly.Blocks['type_array_of']).toBeDefined();
      expect(Blockly.Blocks['type_map_of']).toBeDefined();
      expect(Blockly.Blocks['type_custom']).toBeDefined();
      expect(Blockly.Blocks['type_nullable']).toBeDefined();

      // Verify Functions & Events Category
      expect(Blockly.Blocks['procedure_defnoreturn_custom']).toBeDefined();
      expect(Blockly.Blocks['procedure_defreturn_custom']).toBeDefined();
      expect(Blockly.Blocks['procedure_callnoreturn_custom']).toBeDefined();
      expect(Blockly.Blocks['procedure_callreturn_custom']).toBeDefined();
      expect(Blockly.Blocks['event_listener']).toBeDefined();
      expect(Blockly.Blocks['event_on_start']).toBeDefined();
      expect(Blockly.Blocks['event_on_update']).toBeDefined();
    });

    it('should successfully instantiate blocks from each category in a workspace', () => {
      const bLogic = workspace.newBlock('logic_if_else');
      const bMath = workspace.newBlock('math_number');
      const bText = workspace.newBlock('text_literal');
      const bVar = workspace.newBlock('variables_declare_scoped');
      const bFunc = workspace.newBlock('procedure_defnoreturn_custom');
      const bEvent = workspace.newBlock('event_on_start');

      expect(bLogic.type).toBe('logic_if_else');
      expect(bMath.type).toBe('math_number');
      expect(bText.type).toBe('text_literal');
      expect(bVar.type).toBe('variables_declare_scoped');
      expect(bFunc.type).toBe('procedure_defnoreturn_custom');
      expect(bEvent.type).toBe('event_on_start');

      expect(workspace.getAllBlocks(false).length).toBe(6);
    });
  });

  describe('3. Serialization & Deserialization Roundtrips (JSON <-> Workspace <-> XML)', () => {
    it('should complete JSON object roundtrip (Workspace -> JSON -> Workspace)', () => {
      // 1. Setup workspace state with multiple blocks
      workspace.newBlock('event_on_start');
      workspace.newBlock('math_number');

      expect(workspace.getAllBlocks(false).length).toBe(2);

      // 2. Serialize to JSON state object
      const jsonState = serializeWorkspaceToJson(workspace);
      expect(jsonState.version).toBe('1.0.0');
      expect(jsonState.blocks).toBeDefined();

      // 3. Clear workspace
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      // 4. Deserialize back from JSON object
      const success = deserializeWorkspaceFromJson(workspace, jsonState);
      expect(success).toBe(true);

      const restoredBlocks = workspace.getAllBlocks(false);
      expect(restoredBlocks.length).toBe(2);

      const restoredTypes = restoredBlocks.map((b) => b.type);
      expect(restoredTypes).toContain('event_on_start');
      expect(restoredTypes).toContain('math_number');
    });

    it('should complete JSON string roundtrip (Workspace -> JSON String -> Workspace)', () => {
      workspace.newBlock('event_on_update');
      workspace.newBlock('text_literal');

      const jsonString = serializeWorkspaceToJsonString(workspace, true);
      expect(typeof jsonString).toBe('string');
      expect(jsonString).toContain('event_on_update');
      expect(jsonString).toContain('text_literal');

      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const success = deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(success).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(2);
    });

    it('should complete XML string roundtrip (Workspace -> XML String -> Workspace)', () => {
      workspace.newBlock('event_on_start');
      workspace.newBlock('logic_boolean');

      const xmlText = serializeWorkspaceToXml(workspace, true);
      expect(typeof xmlText).toBe('string');
      expect(xmlText).toContain('<xml');
      expect(xmlText).toContain('event_on_start');
      expect(xmlText).toContain('logic_boolean');

      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const success = deserializeWorkspaceFromXml(workspace, xmlText);
      expect(success).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(2);
    });

    it('should complete cross-format roundtrip (JSON -> Workspace -> XML -> Workspace -> JSON)', () => {
      workspace.newBlock('event_listener');
      workspace.newBlock('math_arithmetic');

      // Workspace -> JSON
      const initialJson = serializeWorkspaceToJsonString(workspace);

      // Workspace -> XML
      const xmlText = serializeWorkspaceToXml(workspace);

      // Clear & Load XML
      workspace.clear();
      deserializeWorkspaceFromXml(workspace, xmlText);
      expect(workspace.getAllBlocks(false).length).toBe(2);

      // Serialize back to JSON
      const finalJson = serializeWorkspaceToJsonString(workspace);

      // Compare block structure equivalence
      const parsedInitial = JSON.parse(initialJson);
      const parsedFinal = JSON.parse(finalJson);

      expect(parsedFinal.blocks.blocks.length).toBe(parsedInitial.blocks.blocks.length);
    });
  });
});
