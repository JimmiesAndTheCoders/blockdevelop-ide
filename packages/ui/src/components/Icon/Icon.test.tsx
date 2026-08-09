import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon } from './Icon';

describe('Icon Component', () => {
  it('should render custom SVG icons (e.g. haxe)', () => {
    render(<Icon name="haxe" color="haxe" size="lg" title="Haxe Logo" />);
    const icon = screen.getByLabelText('Haxe Logo');
    expect(icon).toBeInTheDocument();
    expect(icon.getAttribute('width')).toBe('20');
  });

  it('should render Lucide mapped icons (e.g. play)', () => {
    render(<Icon name="play" color="success" size="sm" title="Play Engine" />);
    const icon = screen.getByLabelText('Play Engine');
    expect(icon).toBeInTheDocument();
  });

  it('should apply spin animation class when spin is true', () => {
    render(<Icon name="refresh" spin title="Loading..." />);
    const icon = screen.getByLabelText('Loading...');
    expect(icon.classList.contains('animate-spin')).toBe(true);
  });

  it('should fallback gracefully to Box icon when given an unknown name', () => {
    render(<Icon name="non-existent-icon-name" title="Fallback" />);
    const icon = screen.getByLabelText('Fallback');
    expect(icon).toBeInTheDocument();
  });
});
