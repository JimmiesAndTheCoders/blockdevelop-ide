import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabNodeHeader } from './TabNodeHeader';

describe('TabNodeHeader Component', () => {
  it('should render title, icon, and dirty star indicator', () => {
    render(<TabNodeHeader title="Player.block" icon="block" isDirty />);

    expect(screen.getByText('Player.block')).toBeInTheDocument();
    expect(screen.getByTestId('tab-dirty-star')).toHaveTextContent('*');
  });

  it('should trigger onClose callback when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<TabNodeHeader title="Main.hx" onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close tab Main.hx');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should open context menu on right click', () => {
    const handleSplitRight = vi.fn();
    render(<TabNodeHeader title="Main.hx" onSplitRight={handleSplitRight} />);

    const tabHeader = screen.getByText('Main.hx');
    fireEvent.contextMenu(tabHeader);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Split Right')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Split Right'));
    expect(handleSplitRight).toHaveBeenCalledTimes(1);
  });
});
