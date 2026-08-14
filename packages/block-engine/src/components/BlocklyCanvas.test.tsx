import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ideEventBus, useUIStore } from '@blockdevelop/core';
import { BlocklyCanvas } from './BlocklyCanvas';

describe('BlocklyCanvas React Component Suite', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    useUIStore.getState().setStatusMessage('Ready');

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    mockUnobserve = vi.fn();

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    })) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render container element and attach ResizeObserver on mount', () => {
    const { container } = render(<BlocklyCanvas fileId="main.block" />);

    expect(container.firstChild).toBeInTheDocument();
    expect(window.ResizeObserver).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('should disconnect ResizeObserver and cleanup workspace on unmount', () => {
    const { unmount } = render(<BlocklyCanvas fileId="main.block" />);

    expect(mockObserve).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should accept onWorkspaceChange and onBlockSelect prop callbacks', () => {
    const handleWorkspaceChange = vi.fn();
    const handleBlockSelect = vi.fn();

    const { container } = render(
      <BlocklyCanvas
        onWorkspaceChange={handleWorkspaceChange}
        onBlockSelect={handleBlockSelect}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should emit block:selected and block:changed events over ideEventBus', () => {
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

  it('should handle Ctrl+Z undo and Ctrl+Y redo keyboard triggers', () => {
    render(<BlocklyCanvas fileId="main.block" />);

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(useUIStore.getState().statusMessage).toContain('undone');

    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(useUIStore.getState().statusMessage).toContain('redone');
  });
});
