import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { useUIStore } from '@blockdevelop/core';

const ThemeTester = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('high-contrast')}>Set High Contrast</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};

describe('ThemeProvider Engine', () => {
  beforeEach(() => {
    useUIStore.getState().setTheme('dark');
    document.documentElement.className = '';
  });

  it('should apply default dark theme to documentElement', () => {
    render(
      <ThemeProvider>
        <ThemeTester />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should dynamically switch theme classes when theme changes', () => {
    render(
      <ThemeProvider>
        <ThemeTester />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Set Light').click();
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('theme-light')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      screen.getByText('Set High Contrast').click();
    });

    expect(screen.getByTestId('theme').textContent).toBe('high-contrast');
    expect(document.documentElement.classList.contains('theme-high-contrast')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
