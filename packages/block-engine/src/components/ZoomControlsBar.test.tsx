import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type * as Blockly from 'blockly/core';
import { ZoomControlsBar } from './ZoomControlsBar';

describe('ZoomControlsBar HUD & Keyboard Shortcuts Suite', () => {
  let mockWorkspace: {
    scale: number;
    zoomCenter: ReturnType<typeof vi.fn>;
    setScale: ReturnType<typeof vi.fn>;
    scrollCenter: ReturnType<typeof vi.fn>;
    zoomToFit: ReturnType<typeof vi.fn>;
    markFocused: ReturnType<typeof vi.fn>;
    addChangeListener: ReturnType<typeof vi.fn>;
    removeChangeListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockWorkspace = {
      scale: 1.0,
      zoomCenter: vi.fn(),
      setScale: vi.fn(),
      scrollCenter: vi.fn(),
      zoomToFit: vi.fn(),
      markFocused: vi.fn(),
      addChangeListener: vi.fn(),
      removeChangeListener: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render zoom HUD controls with 100% initial zoom scale', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    expect(screen.getByRole('toolbar', { name: 'Workspace Zoom Controls' })).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom In')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom Out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset Zoom')).toHaveTextContent('100%');
    expect(screen.getByLabelText('Fit All Blocks to View')).toBeInTheDocument();
  });

  it('should trigger workspace.zoomCenter(1) when Zoom In button is clicked', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    const zoomInBtn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomInBtn);

    expect(mockWorkspace.zoomCenter).toHaveBeenCalledWith(1);
  });

  it('should trigger workspace.zoomCenter(-1) when Zoom Out button is clicked', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    const zoomOutBtn = screen.getByLabelText('Zoom Out');
    fireEvent.click(zoomOutBtn);

    expect(mockWorkspace.zoomCenter).toHaveBeenCalledWith(-1);
  });

  it('should trigger setScale(1.0) and scrollCenter() when Reset Zoom button is clicked', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    const resetBtn = screen.getByLabelText('Reset Zoom');
    fireEvent.click(resetBtn);

    expect(mockWorkspace.setScale).toHaveBeenCalledWith(1.0);
    expect(mockWorkspace.scrollCenter).toHaveBeenCalledTimes(1);
  });

  it('should trigger zoomToFit() when Fit All Blocks to View button is clicked', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    const fitBtn = screen.getByLabelText('Fit All Blocks to View');
    fireEvent.click(fitBtn);

    expect(mockWorkspace.zoomToFit).toHaveBeenCalledTimes(1);
  });

  it('should trigger reset zoom when Ctrl+0 keyboard shortcut is pressed', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    fireEvent.keyDown(window, { key: '0', ctrlKey: true });

    expect(mockWorkspace.setScale).toHaveBeenCalledWith(1.0);
    expect(mockWorkspace.scrollCenter).toHaveBeenCalledTimes(1);
  });

  it('should trigger fit to view when Shift+1 keyboard shortcut is pressed', () => {
    render(<ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />);

    fireEvent.keyDown(window, { key: '1', shiftKey: true });

    expect(mockWorkspace.zoomToFit).toHaveBeenCalledTimes(1);
  });

  it('should unbind change listener on unmount', () => {
    const { unmount } = render(
      <ZoomControlsBar workspace={mockWorkspace as unknown as Blockly.WorkspaceSvg} />
    );

    expect(mockWorkspace.addChangeListener).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockWorkspace.removeChangeListener).toHaveBeenCalledTimes(1);
  });
});
