import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../blocks';
import { buildIDEContextMenuItems, registerCustomContextMenuOptions } from './index';

describe('BlockEngine Context Menu & OOP Actions Suite', () => {
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

  it('should generate baseline block actions for right-clicked blocks', () => {
    const mockBlock = {
      id: 'block_test_123',
      type: 'event_on_start',
      isEnabled: () => true,
      isCollapsed: () => false,
      getCommentText: () => 'Sample block comment',
      setEnabled: vi.fn(),
      setCollapsed: vi.fn(),
      setCommentText: vi.fn(),
      dispose: vi.fn(),
      getInput: vi.fn(),
      getField: vi.fn(),
    } as unknown as Blockly.BlockSvg;

    const items = buildIDEContextMenuItems({ block: mockBlock });
    expect(items.length).toBeGreaterThan(0);

    const actionIds = items.map((i) => i.id);
    expect(actionIds).toContain('duplicate');
    expect(actionIds).toContain('toggle-disable');
    expect(actionIds).toContain('toggle-comment');
    expect(actionIds).toContain('toggle-collapse');
    expect(actionIds).toContain('copy-json');
    expect(actionIds).toContain('jump-to-code');
    expect(actionIds).toContain('delete-block');
  });

  it('should generate OOP specialized actions (Generate Constructor, Abstract Toggle, Export Template) on Class blocks', () => {
    const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
    (classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput).setValue('IDamageable');

    const items = buildIDEContextMenuItems({ block: classBlock });
    const actionIds = items.map((i) => i.id);

    expect(actionIds).toContain('generate-constructor');
    expect(actionIds).toContain('implement-interfaces');
    expect(actionIds).toContain('toggle-abstract');
    expect(actionIds).toContain('export-block-template');
  });

  it('should execute toggle-abstract action and switch modifier between NONE and ABSTRACT', () => {
    const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
    const modField = classBlock.getField('MODIFIER') as Blockly.FieldDropdown;
    expect(modField.getValue()).toBe('NONE');

    const items = buildIDEContextMenuItems({ block: classBlock });
    const toggleAbstractItem = items.find((i) => i.id === 'toggle-abstract');
    expect(toggleAbstractItem).toBeDefined();

    toggleAbstractItem?.onClick?.();
    expect(modField.getValue()).toBe('ABSTRACT');

    // Toggle back
    const updatedItems = buildIDEContextMenuItems({ block: classBlock });
    updatedItems.find((i) => i.id === 'toggle-abstract')?.onClick?.();
    expect(modField.getValue()).toBe('NONE');
  });

  it('should generate workspace context menu options including paste JSON', () => {
    const mockWorkspace = {
      undo: vi.fn(),
      cleanUp: vi.fn(),
      setScale: vi.fn(),
      scrollCenter: vi.fn(),
    } as unknown as Blockly.WorkspaceSvg;

    const items = buildIDEContextMenuItems({ workspace: mockWorkspace });
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => i.id === 'paste-json')).toBe(true);
  });

  it('should register custom context menu options into Blockly.ContextMenuRegistry', () => {
    expect(() => registerCustomContextMenuOptions()).not.toThrow();
  });
});
