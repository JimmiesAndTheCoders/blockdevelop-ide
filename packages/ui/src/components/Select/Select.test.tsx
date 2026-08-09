import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Select, type SelectOption, type SelectGroup } from './Select';

const sampleOptions: SelectOption[] = [
  { value: 'html5', label: 'HTML5 Web Application' },
  { value: 'node', label: 'Node.js Console Application' },
  { value: 'haxe', label: 'Haxe Multi-target' },
  { value: 'python', label: 'Python Engine' },
];

const groupedOptions: SelectGroup[] = [
  {
    label: 'Web & Console',
    options: [
      { value: 'html5', label: 'HTML5 App' },
      { value: 'node', label: 'Node App' },
    ],
  },
  {
    label: 'Compilers',
    options: [{ value: 'haxe', label: 'Haxe Engine' }],
  },
];

describe('Select Component', () => {
  it('should render trigger button with placeholder when no value is selected', () => {
    render(<Select options={sampleOptions} placeholder="Choose Target" />);
    expect(screen.getByText('Choose Target')).toBeInTheDocument();
  });

  it('should open dropdown menu and select an option on click', () => {
    const handleChange = vi.fn();
    render(<Select options={sampleOptions} onChange={handleChange} placeholder="Choose Target" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Haxe Multi-target')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Haxe Multi-target'));
    expect(handleChange).toHaveBeenCalledWith('haxe');
  });

  it('should render grouped options cleanly with group headers', () => {
    render(<Select options={groupedOptions} placeholder="Choose Target" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('Web & Console')).toBeInTheDocument();
    expect(screen.getByText('Compilers')).toBeInTheDocument();
  });

  it('should filter options when search query is entered', () => {
    render(<Select options={sampleOptions} searchable placeholder="Choose Target" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText('Filter options...');
    fireEvent.change(searchInput, { target: { value: 'python' } });

    expect(screen.getByText('Python Engine')).toBeInTheDocument();
    expect(screen.queryByText('HTML5 Web Application')).not.toBeInTheDocument();
  });
});
