import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';

const sampleMenuItems: ContextMenuItem[] = [
  { id: 'cut', label: 'Cut', icon: 'copy', shortcut: 'Ctrl+X', onClick: vi.fn() },
  { id: 'copy', label: 'Copy', icon: 'copy', shortcut: 'Ctrl+C', onClick: vi.fn() },
  { id: 'paste', label: 'Paste', icon: 'copy', shortcut: 'Ctrl+V', disabled: true },
  { id: 'div-1', divider: true },
  { id: 'delete', label: 'Delete Block', icon: 'trash', danger: true, onClick: vi.fn() },
];

describe('ContextMenu Engine', () => {
  it('should render floating context menu items when isOpen is true', () => {
    render(
      <ContextMenu
        isOpen
        position={{ x: 100, y: 100 }}
        onClose={() => {}}
        items={sampleMenuItems}
      />,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Cut')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+C')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('should invoke onClick callback when item is clicked', () => {
    const handleCut = sampleMenuItems[0]?.onClick;
    render(
      <ContextMenu
        isOpen
        position={{ x: 100, y: 100 }}
        onClose={() => {}}
        items={sampleMenuItems}
      />,
    );

    fireEvent.click(screen.getByText('Cut'));
    expect(handleCut).toHaveBeenCalledTimes(1);
  });

  it('should dismiss menu when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <ContextMenu
        isOpen
        position={{ x: 100, y: 100 }}
        onClose={handleClose}
        items={sampleMenuItems}
      />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
