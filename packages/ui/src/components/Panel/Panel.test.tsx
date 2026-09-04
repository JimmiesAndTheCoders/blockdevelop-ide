import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PanelHeader } from './PanelHeader';
import { PanelSection } from './PanelSection';

describe('Panel Components Suite', () => {
  describe('PanelHeader', () => {
    it('should render panel header title and close button', () => {
      const handleClose = vi.fn();
      render(<PanelHeader title="Project Explorer" icon="folder" onClose={handleClose} />);

      expect(screen.getByText('Project Explorer')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText('Close panel');
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should render custom action buttons in actions slot', () => {
      render(<PanelHeader title="Terminal" actions={<button type="button">Clear Logs</button>} />);

      expect(screen.getByRole('button', { name: 'Clear Logs' })).toBeInTheDocument();
    });
  });

  describe('PanelSection', () => {
    it('should toggle collapsed state when header is clicked', () => {
      const handleToggle = vi.fn();
      render(
        <PanelSection title="Dependencies" onToggleCollapse={handleToggle}>
          <div>pnpm packages</div>
        </PanelSection>,
      );

      expect(screen.getByText('pnpm packages')).toBeInTheDocument();

      const header = screen.getByText('Dependencies');
      fireEvent.click(header);

      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });
});
