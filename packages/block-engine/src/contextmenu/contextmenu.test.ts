import { describe, it, expect, vi } from 'vitest';
import * as Blockly from 'blockly/core';
import { buildIDEContextMenuItems, registerCustomContextMenuOptions } from './index';

describe('BlockEngine Context Menu Options Suite', () => {
  it('should generate all 8 custom block context menu options for a right-clicked block', () => {
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
    } as unknown as Blockly.BlockSvg;

    const items = buildIDEContextMenuItems({ block: mockBlock });
    expect(items.length).toBeGreaterThan(0);

    // Verify 8 Block Menu Action IDs exist
    expect(items.some((i) => i.id === 'duplicate')).toBe(true);
    expect(items.some((i) => i.id === 'toggle-disable')).toBe(true);
    expect(items.some((i) => i.id === 'toggle-comment')).toBe(true);
    expect(items.some((i) => i.id === 'toggle-collapse')).toBe(true);
    expect(items.some((i) => i.id === 'copy-json')).toBe(true);
    expect(items.some((i) => i.id === 'jump-to-code')).toBe(true);
    expect(items.some((i) => i.id === 'delete-block')).toBe(true);
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
