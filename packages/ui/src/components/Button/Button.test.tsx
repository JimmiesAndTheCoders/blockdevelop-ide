import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render children text and handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Run Project</Button>);

    const button = screen.getByRole('button', { name: /Run Project/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render correct size and variant classes', () => {
    render(
      <Button variant="accent" size="xs">
        Compact Action
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Compact Action/i });
    expect(button.className).toContain('bg-brand-haxeOrange');
    expect(button.className).toContain('h-[22px]');
  });

  it('should render leftIcon and rightIcon slots', () => {
    render(
      <Button leftIcon="play" rightIcon="chevron-right">
        Start
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Start/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelectorAll('svg').length).toBe(2);
  });

  it('should render spinner and disable button when isLoading is true', () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Compiling
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Compiling/i });
    expect(button).toBeDisabled();
    expect(button.getAttribute('aria-busy')).toBe('true');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
