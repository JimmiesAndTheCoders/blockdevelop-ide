import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

describe('Modal / Dialog Component', () => {
  it('should render modal content when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}} title="New Project Dialog">
        <div>Modal Body Text</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('New Project Dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Body Text')).toBeInTheDocument();
  });

  it('should not render modal content when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Closed Dialog">
        <div>Hidden Body</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should fire onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Test Modal">
        <div>Body</div>
      </Modal>
    );

    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should fire onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} title="ESC Modal">
        <div>Press Escape</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render action footer buttons', () => {
    render(
      <Modal
        isOpen
        onClose={() => {}}
        title="Confirmation"
        footer={<Button variant="primary">Confirm Action</Button>}
      >
        <div>Are you sure?</div>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'Confirm Action' })).toBeInTheDocument();
  });
});
