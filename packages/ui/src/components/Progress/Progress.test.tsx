import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressBar } from './ProgressBar';
import { Spinner } from './Spinner';

describe('Progress Components Suite', () => {
  describe('ProgressBar', () => {
    it('should render determinate progress percentage correctly', () => {
      render(
        <ProgressBar value={75} max={100} label="Compiling Haxe" showPercentage />
      );

      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Compiling Haxe')).toBeInTheDocument();
    });

    it('should render indeterminate bar when value is undefined or indeterminate is true', () => {
      render(<ProgressBar indeterminate label="Indexing Symbols" />);

      const progress = screen.getByRole('progressbar');
      expect(progress).not.toHaveAttribute('aria-valuenow');
      expect(screen.getByTestId('progress-indeterminate')).toBeInTheDocument();
    });
  });

  describe('Spinner', () => {
    it('should render SVG spinner with aria-busy="true"', () => {
      render(<Spinner size="lg" variant="haxe" label="Building project..." />);

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toHaveAttribute('aria-busy', 'true');
      expect(spinner).toHaveAttribute('aria-label', 'Building project...');
      expect(spinner.getAttribute('width')).toBe('28');
    });
  });
});
