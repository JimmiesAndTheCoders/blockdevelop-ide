import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show tooltip content after delay on hover', () => {
    render(
      <Tooltip content="Save File" delay={400} shortcut="Ctrl+S">
        <button type="button">Save</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(button);

    // Fast-forward fake timer by 400ms
    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Save File');
    expect(tooltip).toHaveTextContent('Ctrl+S');

    fireEvent.mouseLeave(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip content on focus', () => {
    render(
      <Tooltip content="Build Project" delay={0}>
        <button type="button">Build</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Build' });
    fireEvent.focus(button);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Build Project');

    fireEvent.blur(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should not show tooltip when disabled is true', () => {
    render(
      <Tooltip content="Disabled Tooltip" disabled delay={0}>
        <button type="button">Action</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Action' });
    fireEvent.mouseEnter(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
