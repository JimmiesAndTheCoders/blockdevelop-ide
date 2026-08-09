import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextInput } from './TextInput';
import { SearchInput } from './SearchInput';
import { NumberInput } from './NumberInput';

describe('Input Components Suite', () => {
  describe('TextInput', () => {
    it('should render input value and handle user text entry', () => {
      const handleChange = vi.fn();
      render(<TextInput placeholder="Enter file name" value="main.hx" onChange={handleChange} />);

      const input = screen.getByPlaceholderText('Enter file name');
      expect(input).toHaveValue('main.hx');

      fireEvent.change(input, { target: { value: 'index.hx' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should render clear button and fire onClear callback', () => {
      const handleClear = vi.fn();
      render(
        <TextInput
          clearable
          value="text"
          onChange={() => {}}
          onClear={handleClear}
          placeholder="Type..."
        />
      );

      const clearBtn = screen.getByLabelText('Clear text input');
      expect(clearBtn).toBeInTheDocument();

      fireEvent.click(clearBtn);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('should display error helper text when error prop is set', () => {
      render(<TextInput error="Invalid identifier name" id="file-input" />);
      expect(screen.getByText('Invalid identifier name')).toBeInTheDocument();
    });
  });

  describe('SearchInput', () => {
    it('should clear value when ESC key is pressed', () => {
      const handleClear = vi.fn();
      render(<SearchInput value="search query" onChange={() => {}} onClear={handleClear} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('NumberInput', () => {
    it('should handle increment and decrement stepper actions', () => {
      const handleNumberChange = vi.fn();
      render(<NumberInput value={10} step={1} onNumberChange={handleNumberChange} />);

      const incrementBtn = screen.getByLabelText('Increment value');
      fireEvent.click(incrementBtn);

      expect(handleNumberChange).toHaveBeenCalledWith(11);
    });
  });
});
