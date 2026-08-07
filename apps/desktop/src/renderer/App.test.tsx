import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

// Mock window.blockDevelopAPI bridge
Object.defineProperty(window, 'blockDevelopAPI', {
  value: {
    system: {
      getSystemInfo: vi.fn().mockResolvedValue({
        appVersion: '0.1.0',
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

describe('App Component Sanity Suite', () => {
  it('should render the BlockDevelop IDE title header', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('BlockDevelop IDE')).toBeInTheDocument();
    });
  });

  it('should render core engine metadata', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Visual Block Develop IDE')).toBeInTheDocument();
    });
  });
});
