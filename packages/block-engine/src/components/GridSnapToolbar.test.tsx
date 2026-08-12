import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type * as Blockly from 'blockly/core';
import { GridSnapToolbar } from './GridSnapToolbar';

describe('GridSnapToolbar Suite', () => {
  it('should render grid mode, snap toggle, and spacing dropdown', () => {
    const mockWorkspace = {
      getGrid: () => ({ setSpacing: vi.fn() }),
      options: { gridOptions: { snap: true } },
    } as unknown as Blockly.WorkspaceSvg;

    render(<GridSnapToolbar workspace={mockWorkspace} />);

    expect(screen.getByLabelText('Toggle Grid Visibility')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle Snap to Grid')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should toggle grid mode and snap state on button click', () => {
    const mockWorkspace = {
      getGrid: () => ({ setSpacing: vi.fn() }),
      options: { gridOptions: { snap: true } },
    } as unknown as Blockly.WorkspaceSvg;

    render(<GridSnapToolbar workspace={mockWorkspace} />);

    const gridBtn = screen.getByLabelText('Toggle Grid Visibility');
    fireEvent.click(gridBtn);
    expect(gridBtn).toHaveTextContent('LINES');

    const snapBtn = screen.getByLabelText('Toggle Snap to Grid');
    fireEvent.click(snapBtn);
    expect(snapBtn).toHaveTextContent('SNAP OFF');
  });
});
