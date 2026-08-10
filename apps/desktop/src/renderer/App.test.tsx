import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '@blockdevelop/ui';
import { App } from './App';

// Mock window.blockDevelopAPI bridge
Object.defineProperty(window, 'blockDevelopAPI', {
  value: {
    system: {
      getSystemInfo: vi.fn().mockResolvedValue({
        appVersion: '0.3.0',
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

describe('App Component Sanity Suite', () => {
  it('should render the BlockDevelop IDE title header', async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByText('BlockDevelop IDE')).toBeInTheDocument();
    });
  });

  it('should render core engine metadata', async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Block Engine Initialized/i)).toBeInTheDocument();
    });
  });
});
