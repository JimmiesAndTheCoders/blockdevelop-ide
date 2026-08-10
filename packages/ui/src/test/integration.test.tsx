import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ThemeProvider,
  useTheme,
  Button,
  TextInput,
  Select,
  Checkbox,
  Switch,
  Badge,
  ProgressBar,
  Spinner,
  Kbd,
} from '../index';
import { useUIStore } from '@blockdevelop/core';

const IntegratedWorkspaceUI = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div data-testid="workspace-wrapper">
      <span data-testid="active-theme">{theme}</span>
      <Button onClick={() => setTheme('light')}>Set Light Theme</Button>
      <Button onClick={() => setTheme('high-contrast')}>Set High Contrast</Button>

      <TextInput placeholder="Workspace Input" value="test" onChange={() => {}} />
      <Select
        options={[
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
        ]}
        value="opt1"
      />
      <Checkbox label="Auto save" defaultChecked />
      <Switch label="Live mode" defaultChecked />
      <Badge variant="haxe">Haxe 4.3</Badge>
      <ProgressBar value={50} showPercentage />
      <Spinner size="sm" />
      <Kbd shortcut="Ctrl+S" />
    </div>
  );
};

describe('UI Primitives Integration & Theme State Transitions Suite', () => {
  beforeEach(() => {
    useUIStore.getState().setTheme('dark');
    document.documentElement.className = '';
  });

  it('should render full workspace UI component tree inside ThemeProvider', () => {
    render(
      <ThemeProvider>
        <IntegratedWorkspaceUI />
      </ThemeProvider>
    );

    expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
    expect(screen.getByRole('button', { name: 'Set Light Theme' })).toBeInTheDocument();
    expect(screen.getByText('Haxe 4.3')).toBeInTheDocument();
  });

  it('should reactively update document classes and component states on theme transition', () => {
    render(
      <ThemeProvider>
        <IntegratedWorkspaceUI />
      </ThemeProvider>
    );

    const lightBtn = screen.getByRole('button', { name: 'Set Light Theme' });
    act(() => {
      fireEvent.click(lightBtn);
    });

    expect(screen.getByTestId('active-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('theme-light')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(true);

    const hcBtn = screen.getByRole('button', { name: 'Set High Contrast' });
    act(() => {
      fireEvent.click(hcBtn);
    });

    expect(screen.getByTestId('active-theme')).toHaveTextContent('high-contrast');
    expect(document.documentElement.classList.contains('theme-high-contrast')).toBe(true);
  });
});
