import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge, Tag } from './Badge';

describe('Badge & Tag Component Suite', () => {
  it('should render badge label with correct variant styling', () => {
    render(<Badge variant="haxe">Haxe 4.3</Badge>);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Haxe 4.3');
    expect(badge.className).toContain('text-brand-haxeOrange');
  });

  it('should render optional icon in icon slot', () => {
    render(<Badge icon="cpu">Node.js</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.querySelector('svg')).toBeInTheDocument();
  });

  it('should render dismissible cross button and fire onDismiss callback', () => {
    const handleDismiss = vi.fn();
    render(
      <Badge dismissible onDismiss={handleDismiss}>
        Dismissible Tag
      </Badge>
    );

    const closeBtn = screen.getByLabelText('Dismiss badge');
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('should support Tag alias component', () => {
    render(<Tag variant="success">Active Target</Tag>);
    const tag = screen.getByRole('status');
    expect(tag).toHaveTextContent('Active Target');
    expect(tag.className).toContain('text-emerald-300');
  });
});
