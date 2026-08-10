import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Kbd } from './Kbd';

describe('Kbd Component', () => {
  it('should render single children text inside <kbd>', () => {
    render(<Kbd>Enter</Kbd>);
    const kbd = screen.getByText('Enter');
    expect(kbd).toBeInTheDocument();
    expect(kbd.tagName.toLowerCase()).toBe('kbd');
  });

  it('should parse shortcut string into individual key chips', () => {
    render(<Kbd shortcut="Ctrl+Shift+P" size="sm" />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('should render array of keys passed via keys prop', () => {
    render(<Kbd keys={['Cmd', 'K']} size="md" />);
    expect(screen.getByText('Cmd')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });
});
