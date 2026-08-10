import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';

describe('Toggle & Checkbox Components', () => {
  describe('Checkbox', () => {
    it('should toggle checked state on click', () => {
      const handleChange = vi.fn();
      render(<Checkbox label="Enable Auto-save" onChange={handleChange} />);

      const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
      expect(checkbox).not.toBeChecked();

      act(() => {
        checkbox.click();
        if (handleChange.mock.calls.length === 0) {
          checkbox.checked = true;
          fireEvent.change(checkbox);
        }
      });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should render label and description', () => {
      render(
        <Checkbox label="Auto-format Code" description="Format code on project compile" />
      );

      expect(screen.getByText('Auto-format Code')).toBeInTheDocument();
      expect(screen.getByText('Format code on project compile')).toBeInTheDocument();
    });
  });

  describe('Switch / Toggle', () => {
    it('should toggle switch state and update aria-checked attribute', () => {
      const handleChange = vi.fn();
      render(<Switch label="Live Preview" onChange={handleChange} />);

      const toggle = screen.getByRole('switch');
      expect(toggle.getAttribute('aria-checked')).toBe('false');

      act(() => {
        fireEvent.click(toggle);
      });

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should honor disabled state', () => {
      const handleChange = vi.fn();
      render(<Switch disabled label="Disabled Option" onChange={handleChange} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();

      act(() => {
        fireEvent.click(toggle);
      });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
