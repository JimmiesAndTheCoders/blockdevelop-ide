import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusIcon } from './StatusIcon';

describe('StatusIcon Component', () => {
  it('should render base icon without status overlay when status is undefined', () => {
    render(<StatusIcon name="file" title="Normal File" />);
    const icon = screen.getByLabelText('Normal File');
    expect(icon).toBeInTheDocument();
    expect(screen.queryByTestId('status-badge-modified')).not.toBeInTheDocument();
  });

  it('should render modified dot badge when status is modified or dirty', () => {
    render(<StatusIcon name="file-code" status="modified" title="Unsaved File" />);
    expect(screen.getByTestId('status-badge-modified')).toBeInTheDocument();
  });

  it('should render lock badge when status is lock or readonly', () => {
    render(<StatusIcon name="file" status="readonly" title="Readonly File" />);
    expect(screen.getByTestId('status-badge-lock')).toBeInTheDocument();
  });

  it('should render spinning sync badge when status is loading or sync', () => {
    render(<StatusIcon name="folder" status="sync" title="Syncing Folder" />);
    const badge = screen.getByTestId('status-badge-loading');
    expect(badge).toBeInTheDocument();
    expect(badge.classList.contains('animate-spin')).toBe(true);
  });

  it('should render error and warning status overlay badges', () => {
    const { rerender } = render(<StatusIcon name="block" status="error" title="Error Block" />);
    expect(screen.getByTestId('status-badge-error')).toBeInTheDocument();

    rerender(<StatusIcon name="block" status="warning" title="Warning Block" />);
    expect(screen.getByTestId('status-badge-warning')).toBeInTheDocument();
  });
});
