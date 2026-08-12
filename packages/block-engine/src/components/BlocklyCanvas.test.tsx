import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ideEventBus, useUIStore } from '@blockdevelop/core';
import { BlocklyCanvas } from './BlocklyCanvas';

describe('BlocklyCanvas Lifecycle, State Sync & Event Bus Suite', () => {
  beforeEach(() => {
    useUIStore.getState().setStatusMessage('Ready');
    if (typeof window !== 'undefined' && !window.ResizeObserver) {
      window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;
    }
  });

  it('should render container div and mount workspace without throwing', () => {
    const handleWorkspaceChange = vi.fn();
    const { container, unmount } = render(
      <BlocklyCanvas onWorkspaceChange={handleWorkspaceChange} />
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });

  it('should handle Ctrl+Z and Ctrl+Y keyboard undo/redo shortcuts', () => {
    render(<BlocklyCanvas fileId="test-file.block" />);

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(useUIStore.getState().statusMessage).toContain('undone');

    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(useUIStore.getState().statusMessage).toContain('redone');
  });

  it('should allow emitting block:selected and block:changed events over ideEventBus', () => {
    const handleBlockSelected = vi.fn();
    const handleBlockChanged = vi.fn();

    ideEventBus.on('block:selected', handleBlockSelected);
    ideEventBus.on('block:changed', handleBlockChanged);

    ideEventBus.emit('block:selected', { blockId: 'block_01', blockType: 'event_on_start' });
    ideEventBus.emit('block:changed', { fileId: 'main.block', blockCount: 5 });

    expect(handleBlockSelected).toHaveBeenCalledWith({
      blockId: 'block_01',
      blockType: 'event_on_start',
    });
    expect(handleBlockChanged).toHaveBeenCalledWith({
      fileId: 'main.block',
      blockCount: 5,
    });

    ideEventBus.off('block:selected', handleBlockSelected);
    ideEventBus.off('block:changed', handleBlockChanged);
  });
});
