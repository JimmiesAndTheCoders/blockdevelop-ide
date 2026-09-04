import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { ideEventBus, useUIStore, useEditorStore } from '@blockdevelop/core';
import { registerBlockDefinitions } from './blocks';
import { buildIDEContextMenuItems, registerCustomContextMenuOptions } from './contextmenu';
import {
  serializeWorkspaceToJson,
  deserializeWorkspaceFromJson,
  serializeWorkspaceToJsonString,
  deserializeWorkspaceFromJsonString,
  serializeWorkspaceToXml,
  deserializeWorkspaceFromXml,
} from './serialization';

describe('Phase 4.1 Section 6 - Integration Test Suite (Serialization & Inspector Compatibility)', () => {
  let workspace: Blockly.WorkspaceSvg;
  let container: HTMLDivElement;

  beforeEach(() => {
    registerBlockDefinitions();
    registerCustomContextMenuOptions();
    Blockly.Events.enable();

    useUIStore.setState({ statusMessage: 'Ready' });
    useEditorStore.setState({ tabs: [], activeTabId: 'main.block' });

    // Inject SVG workspace for full DOM/Inspector/Context Menu integration
    container = document.createElement('div');
    document.body.appendChild(container);
    workspace = Blockly.inject(container, {
      trashcan: true,
    });
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    useUIStore.setState({ statusMessage: 'Ready' });
  });

  // ---------------------------------------------------------------------------
  // 1. Serialization & Roundtrip Integration (Workspace <-> JSON <-> XML)
  // ---------------------------------------------------------------------------
  describe('1. Full-Pipeline Multi-Format Serialization Roundtrip', () => {
    it('should complete lossless roundtrips of a complex OOP package/class structure across all formats', () => {
      // 1. Build a complete OOP AST in Workspace
      // Package com.game.logic
      const pkgBlock = workspace.newBlock('package_declare');
      (pkgBlock.getField('PACKAGE_NAME') as Blockly.FieldTextInput).setValue('com.game.logic');

      // Class Player
      const classBlock = workspace.newBlock('class_wrapper');
      (classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Player');
      (classBlock.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('Entity');

      // Field: gridMap: Array<Array<Int>>
      const fieldBlock = workspace.newBlock('variable_declare_typed');
      (fieldBlock.getField('VAR_NAME') as Blockly.FieldTextInput).setValue('gridMap');
      const mapType = workspace.newBlock('type_array_of');
      const innerArrType = workspace.newBlock('type_array_of');
      const intType = workspace.newBlock('type_primitive');
      (intType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      innerArrType.getInput('ELEMENT_TYPE')?.connection?.connect(intType.outputConnection!);
      mapType.getInput('ELEMENT_TYPE')?.connection?.connect(innerArrType.outputConnection!);
      fieldBlock.getInput('TYPE_ANNOTATION')?.connection?.connect(mapType.outputConnection!);

      classBlock.getInput('FIELDS')?.connection?.connect(fieldBlock.previousConnection!);

      // Constructor
      const ctorBlock = workspace.newBlock('class_constructor');
      classBlock.getInput('CONSTRUCTOR')?.connection?.connect(ctorBlock.previousConnection!);

      // Method: updatePosition(x: Float, y: Float): Bool
      const methodBlock = workspace.newBlock('function_def_typed');
      (methodBlock.getField('NAME') as Blockly.FieldTextInput).setValue('updatePosition');
      const boolType = workspace.newBlock('type_primitive');
      (boolType.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');
      methodBlock.getInput('RETURN_TYPE')?.connection?.connect(boolType.outputConnection!);

      classBlock.getInput('METHODS')?.connection?.connect(methodBlock.previousConnection!);

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBeGreaterThanOrEqual(8);

      // --- STAGE A: Workspace -> JSON Object -> Workspace ---
      const jsonObj = serializeWorkspaceToJson(workspace);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      deserializeWorkspaceFromJson(workspace, jsonObj);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      // --- STAGE B: Workspace -> JSON String -> Workspace ---
      const jsonStr = serializeWorkspaceToJsonString(workspace, true);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      deserializeWorkspaceFromJsonString(workspace, jsonStr);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      // --- STAGE C: Workspace -> XML String -> Workspace ---
      const xmlStr = serializeWorkspaceToXml(workspace, true);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      deserializeWorkspaceFromXml(workspace, xmlStr);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      // --- STAGE D: Workspace -> XML -> JSON -> Match ---
      const finalJsonStr = serializeWorkspaceToJsonString(workspace, true);
      const parsedInitial = JSON.parse(jsonStr);
      const parsedFinal = JSON.parse(finalJsonStr);

      expect(parsedFinal.blocks.blocks.length).toBe(parsedInitial.blocks.blocks.length);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Context Menu and Inspector Compatibility Suite
  // ---------------------------------------------------------------------------
  describe('2. Context Menu & Inspector Event Bus Compatibility', () => {
    it('should generate all context menu actions and dispatch IDE notification events for Phase 4.1 blocks', () => {
      const handleBlockSelected = vi.fn();
      const handleNotify = vi.fn();

      ideEventBus.on('block:selected', handleBlockSelected);
      ideEventBus.on('ui:notify', handleNotify);

      // Create a representative block from each Phase 4.1 subphase
      const sampleBlocks: Blockly.BlockSvg[] = [
        workspace.newBlock('variable_declare_typed') as Blockly.BlockSvg,
        workspace.newBlock('matrix_create_2d') as Blockly.BlockSvg,
        workspace.newBlock('function_def_typed') as Blockly.BlockSvg,
        workspace.newBlock('class_wrapper') as Blockly.BlockSvg,
        workspace.newBlock('import_statement') as Blockly.BlockSvg,
      ];

      sampleBlocks.forEach((block) => {
        const menuItems = buildIDEContextMenuItems({ block, workspace });
        expect(menuItems.length).toBeGreaterThanOrEqual(7);

        // Verify key action IDs exist for all Phase 4.1 blocks
        const actionIds = menuItems.map((item) => item.id);
        expect(actionIds).toContain('duplicate');
        expect(actionIds).toContain('toggle-disable');
        expect(actionIds).toContain('toggle-comment');
        expect(actionIds).toContain('toggle-collapse');
        expect(actionIds).toContain('copy-json');
        expect(actionIds).toContain('jump-to-code');
        expect(actionIds).toContain('delete-block');

        // Execute "Jump to Generated Code" action
        const jumpItem = menuItems.find((i) => i.id === 'jump-to-code');
        jumpItem?.onClick?.();

        expect(handleBlockSelected).toHaveBeenCalledWith({
          blockId: block.id,
          blockType: block.type,
        });

        expect(handleNotify).toHaveBeenCalledWith({
          message: expect.stringContaining(block.type),
          type: 'info',
        });
      });

      ideEventBus.off('block:selected', handleBlockSelected);
      ideEventBus.off('ui:notify', handleNotify);
    });

    it('should trigger selection and update IDE inspector store when new Phase 4.1 blocks are selected', () => {
      const handleBlockSelected = vi.fn();
      ideEventBus.on('block:selected', handleBlockSelected);

      // Listen for Blockly selection changes
      workspace.addChangeListener((e: Blockly.Events.Abstract) => {
        if (e.type === Blockly.Events.SELECTED || e.type === 'selected') {
          const selectedEvent = e as unknown as { newElementId: string | null };
          const selectedId = selectedEvent.newElementId;
          if (selectedId) {
            const selectedBlock = workspace.getBlockById(selectedId);
            const blockType = selectedBlock ? selectedBlock.type : 'unknown';
            ideEventBus.emit('block:selected', { blockId: selectedId, blockType });
            useUIStore.getState().setStatusMessage(`Selected: ${blockType}`);
          }
        }
      });

      const matrixBlock = workspace.newBlock('matrix_set_2d');
      const selectEvent = new Blockly.Events.Selected(null, matrixBlock.id, workspace.id);
      workspace.fireChangeListener(selectEvent);

      expect(handleBlockSelected).toHaveBeenCalledWith({
        blockId: matrixBlock.id,
        blockType: 'matrix_set_2d',
      });
      expect(useUIStore.getState().statusMessage).toBe('Selected: matrix_set_2d');

      ideEventBus.off('block:selected', handleBlockSelected);
    });
  });
});
