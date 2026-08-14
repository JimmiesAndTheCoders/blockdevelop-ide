import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { ideEventBus, useUIStore, useEditorStore } from '@blockdevelop/core';
import { registerBlockDefinitions } from './blocks';
import { buildIDEContextMenuItems } from './contextmenu';

describe('Phase 4.8 Integration Test Suite - Blockly Workspace to ideEventBus', () => {
  let workspace: Blockly.WorkspaceSvg;
  let container: HTMLDivElement;

  beforeEach(() => {
    registerBlockDefinitions();
    Blockly.Events.enable();
    useUIStore.setState({ statusMessage: 'Ready' });
    useEditorStore.setState({ tabs: [], activeTabId: 'main.block' });

    // Create SVG workspace in DOM container
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

  it('should dispatch block:changed event on ideEventBus when a block is created in workspace', () => {
    const handleBlockChanged = vi.fn();
    ideEventBus.on('block:changed', handleBlockChanged);

    // Setup event bridge listener matching BlocklyCanvas implementation
    workspace.addChangeListener((e: Blockly.Events.Abstract) => {
      if (
        e.type === Blockly.Events.BLOCK_CREATE ||
        e.type === Blockly.Events.BLOCK_DELETE ||
        e.type === Blockly.Events.BLOCK_CHANGE ||
        e.type === 'create' ||
        e.type === 'delete' ||
        e.type === 'change'
      ) {
        const count = workspace.getAllBlocks(false).length;
        ideEventBus.emit('block:changed', {
          fileId: 'main.block',
          blockCount: count,
        });
      }
    });

    // Create block and fire creation event directly to workspace listeners
    const block = workspace.newBlock('event_on_start');
    const createEvent = new Blockly.Events.BlockCreate(block);
    workspace.fireChangeListener(createEvent);

    expect(handleBlockChanged).toHaveBeenCalledWith({
      fileId: 'main.block',
      blockCount: 1,
    });

    ideEventBus.off('block:changed', handleBlockChanged);
  });

  it('should dispatch block:selected event on ideEventBus and update uiStore when a block is selected', () => {
    const handleBlockSelected = vi.fn();
    ideEventBus.on('block:selected', handleBlockSelected);

    workspace.addChangeListener((e: Blockly.Events.Abstract) => {
      if (e.type === Blockly.Events.SELECTED || e.type === 'selected') {
        const selectedEvent = e as unknown as { newElementId: string | null };
        const selectedId = selectedEvent.newElementId;
        if (selectedId) {
          const selectedBlock = workspace.getBlockById(selectedId);
          const blockType = selectedBlock ? selectedBlock.type : 'unknown';
          ideEventBus.emit('block:selected', { blockId: selectedId, blockType });
          useUIStore.getState().setStatusMessage(`Selected Block: ${blockType}`);
        }
      }
    });

    const block = workspace.newBlock('math_number');

    // Fire selected event directly to workspace listeners
    const selectEvent = new Blockly.Events.Selected(null, block.id, workspace.id);
    workspace.fireChangeListener(selectEvent);

    expect(handleBlockSelected).toHaveBeenCalledWith({
      blockId: block.id,
      blockType: 'math_number',
    });
    expect(useUIStore.getState().statusMessage).toBe('Selected Block: math_number');

    ideEventBus.off('block:selected', handleBlockSelected);
  });

  it('should dispatch block:changed event on ideEventBus when a block is deleted from workspace', () => {
    const handleBlockChanged = vi.fn();
    ideEventBus.on('block:changed', handleBlockChanged);

    workspace.addChangeListener((e: Blockly.Events.Abstract) => {
      if (
        e.type === Blockly.Events.BLOCK_CREATE ||
        e.type === Blockly.Events.BLOCK_DELETE ||
        e.type === 'create' ||
        e.type === 'delete'
      ) {
        const count = workspace.getAllBlocks(false).length;
        ideEventBus.emit('block:changed', {
          fileId: 'main.block',
          blockCount: count,
        });
      }
    });

    workspace.newBlock('event_on_start');
    const block2 = workspace.newBlock('math_number');
    expect(workspace.getAllBlocks(false).length).toBe(2);

    // Dispose block2 and fire delete event directly to workspace listeners
    const deleteEvent = new Blockly.Events.BlockDelete(block2);
    block2.dispose(true);
    workspace.fireChangeListener(deleteEvent);

    expect(handleBlockChanged).toHaveBeenLastCalledWith({
      fileId: 'main.block',
      blockCount: 1,
    });

    ideEventBus.off('block:changed', handleBlockChanged);
  });

  it('should dispatch block:selected and ui:notify events when Jump to Code context menu option is triggered', () => {
    const handleBlockSelected = vi.fn();
    const handleNotify = vi.fn();

    ideEventBus.on('block:selected', handleBlockSelected);
    ideEventBus.on('ui:notify', handleNotify);

    const block = workspace.newBlock('procedure_defnoreturn_custom') as Blockly.BlockSvg;

    const menuItems = buildIDEContextMenuItems({ block });
    const jumpToCodeItem = menuItems.find((item) => item.id === 'jump-to-code');

    expect(jumpToCodeItem).toBeDefined();

    // Execute context menu action
    jumpToCodeItem?.onClick?.();

    expect(handleBlockSelected).toHaveBeenCalledWith({
      blockId: block.id,
      blockType: 'procedure_defnoreturn_custom',
    });

    expect(handleNotify).toHaveBeenCalledWith({
      message: `Navigated to code generated for block 'procedure_defnoreturn_custom' (${block.id})`,
      type: 'info',
    });

    ideEventBus.off('block:selected', handleBlockSelected);
    ideEventBus.off('ui:notify', handleNotify);
  });
});
