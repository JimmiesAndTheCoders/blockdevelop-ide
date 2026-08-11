import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '@blockdevelop/ui';
import { useLayoutStore, useEditorStore, useUIStore } from '@blockdevelop/core';
import { App } from './App';

// Mock window.blockDevelopAPI bridge
Object.defineProperty(window, 'blockDevelopAPI', {
  value: {
    system: {
      getSystemInfo: vi.fn().mockResolvedValue({
        appVersion: '0.4.0-beta.6',
        electronVersion: '29.1.0',
        chromeVersion: '122.0.0.0',
        nodeVersion: '20.11.0',
        platform: 'win32',
      }),
    },
    dialog: {
      openFile: vi.fn(),
      saveFile: vi.fn(),
    },
    process: {
      spawn: vi.fn(),
      kill: vi.fn(),
      onData: vi.fn().mockReturnValue(() => {}),
    },
  },
  writable: true,
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="dark">{ui}</ThemeProvider>);
};

describe('Desktop App Component & Dock Layout Integration Suite', () => {
  beforeEach(() => {
    useLayoutStore.getState().resetLayout();
    useEditorStore.setState({ tabs: [], activeTabId: null });
    useUIStore.setState({ isSidebarOpen: true, theme: 'dark' });
  });

  it('should render the BlockDevelop IDE title header and core engine metadata', async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByText('BlockDevelop IDE')).toBeInTheDocument();
      expect(screen.getByText(/Block Engine Initialized/i)).toBeInTheDocument();
    });
  });

  it('should render document tab bar and support tab selection and close actions', async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('Main.hx')).toBeInTheDocument();
      expect(screen.getByText('Player.block')).toBeInTheDocument();
    });

    // Select second tab
    const secondTab = screen.getByText('Player.block');
    fireEvent.click(secondTab);

    // Close second tab
    const closeBtn = screen.getByLabelText('Close tab Player.block');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Player.block')).not.toBeInTheDocument();
    });
  });

  it('should render layout preset switcher controls in top application header', async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('Default Workspace')).toBeInTheDocument();
    });
  });

  it('should toggle sidebar visibility when Ctrl+B keyboard shortcut is pressed', async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('Project Explorer')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
    });

    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it('should trigger reset window layout command when reset button is clicked', async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      const resetBtn = screen.getByLabelText('Reset Window Layout');
      expect(resetBtn).toBeInTheDocument();
      fireEvent.click(resetBtn);
    });

    expect(useUIStore.getState().statusMessage).toContain('Workspace window layout reset');
  });
});
